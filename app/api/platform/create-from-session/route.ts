import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { allocatePortfolioSlug } from "@/lib/platform/allocate-portfolio-slug";
import { extractProfileFromSupabaseUser } from "@/lib/platform/oauth-profile";
import { seedNewPortfolioFromDefaults } from "@/lib/platform/seed-new-portfolio";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";

/**
 * One-shot portfolio creation for an authenticated user without `platform_users` yet.
 * Uses session user metadata (e.g. Google) for display name, avatar, and slug base.
 */
export async function POST() {
  const sessionClient = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await sessionClient.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let admin;
  try {
    admin = createSupabaseServiceRoleClient();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server misconfiguration";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  const { data: existing } = await admin.from("platform_users").select("slug").eq("id", user.id).maybeSingle();
  if (existing?.slug) {
    return NextResponse.json({ ok: true, slug: existing.slug, existing: true });
  }

  const extracted = extractProfileFromSupabaseUser(user);
  let slug: string;
  try {
    slug = await allocatePortfolioSlug(admin, extracted.slugBase);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Slug allocation failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }

  const template_id = "minimal";

  const { error: insertError } = await admin.from("platform_users").insert({
    id: user.id,
    slug,
    display_name: extracted.displayName,
    role: extracted.role,
    email: user.email ?? null,
    avatar_url: extracted.avatarUrl,
    template_id,
    is_published: false,
  });

  if (insertError) {
    return NextResponse.json({ ok: false, error: insertError.message }, { status: 400 });
  }

  try {
    await seedNewPortfolioFromDefaults(admin, user.id, {
      display_name: extracted.displayName,
      role: extracted.role,
      slug,
      email: user.email ?? null,
      avatar_url: extracted.avatarUrl,
    });
  } catch (seedErr) {
    await admin.from("platform_users").delete().eq("id", user.id);
    const message = seedErr instanceof Error ? seedErr.message : "Seed failed";
    const hint =
      message.includes("cms_user") || message.includes("does not exist")
        ? " Run the SQL in supabase/migrations/20260411_platform_users_cms_jsonb.sql on your Supabase project, then try again."
        : "";
    return NextResponse.json({ ok: false, error: `${message}${hint}` }, { status: 500 });
  }

  revalidatePath(`/u/${slug}`);
  revalidatePath(`/u/${slug}/work`);
  return NextResponse.json({ ok: true, slug });
}
