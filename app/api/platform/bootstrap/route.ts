import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { normalizeSlug, validateSlugFormat } from "@/lib/platform/slug";
import { seedNewPortfolioFromDefaults } from "@/lib/platform/seed-new-portfolio";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";

type Body = {
  slug?: string;
  display_name?: string;
  role?: string | null;
  template_id?: string;
  avatar_url?: string | null;
};

const ALLOWED_TEMPLATES = new Set(["minimal"]);

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? normalizeSlug(body.slug) : "";
  const display_name = typeof body.display_name === "string" ? body.display_name.trim() : "";
  const role = typeof body.role === "string" ? body.role.trim() || null : null;
  const template_id =
    typeof body.template_id === "string" && ALLOWED_TEMPLATES.has(body.template_id)
      ? body.template_id
      : "minimal";
  const avatar_url =
    typeof body.avatar_url === "string" && body.avatar_url.trim().length > 0 ? body.avatar_url.trim() : null;

  const slugErr = validateSlugFormat(slug);
  if (slugErr) {
    return NextResponse.json({ ok: false, error: slugErr }, { status: 400 });
  }
  if (display_name.length < 1) {
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  }
  if (display_name.length > 120) {
    return NextResponse.json({ ok: false, error: "Name is too long." }, { status: 400 });
  }
  if (avatar_url && avatar_url.length > 2048) {
    return NextResponse.json({ ok: false, error: "Image URL is too long." }, { status: 400 });
  }

  const sessionClient = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await sessionClient.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = createSupabaseServiceRoleClient();

    const { data: taken } = await admin.from("platform_users").select("id").eq("slug", slug).maybeSingle();
    if (taken) {
      return NextResponse.json({ ok: false, error: "That slug is already taken." }, { status: 409 });
    }

    const { data: existingProfile } = await admin
      .from("platform_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (existingProfile) {
      return NextResponse.json({ ok: false, error: "You already have a portfolio profile." }, { status: 409 });
    }

    const { error: insertError } = await admin.from("platform_users").insert({
      id: user.id,
      slug,
      display_name,
      role,
      email: user.email ?? null,
      avatar_url,
      template_id,
      is_published: false,
    });

    if (insertError) {
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 400 });
    }

    try {
      await seedNewPortfolioFromDefaults(admin, user.id, {
        display_name,
        role,
        slug,
        email: user.email ?? null,
        avatar_url,
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
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
