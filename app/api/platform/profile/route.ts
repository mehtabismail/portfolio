import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requirePlatformApiUser } from "@/lib/platform/api-auth";
import { normalizeSlug, validateSlugFormat } from "@/lib/platform/slug";

type Body = {
  slug?: string;
  display_name?: string;
  role?: string | null;
  location?: string | null;
  bio?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  template_id?: string;
  is_published?: boolean;
};

const ALLOWED_TEMPLATES = new Set(["minimal"]);

export async function PATCH(request: Request) {
  const auth = await requirePlatformApiUser();
  if (!auth.ok) return auth.response;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { user, profile, admin } = auth;
  const updates: Record<string, unknown> = {};

  if (body.display_name !== undefined) {
    const name = typeof body.display_name === "string" ? body.display_name.trim() : "";
    if (name.length < 1) {
      return NextResponse.json({ ok: false, error: "Display name is required." }, { status: 400 });
    }
    if (name.length > 120) {
      return NextResponse.json({ ok: false, error: "Display name is too long." }, { status: 400 });
    }
    updates.display_name = name;
  }

  if (body.role !== undefined) {
    updates.role = typeof body.role === "string" ? body.role.trim() || null : null;
  }
  if (body.location !== undefined) {
    updates.location = typeof body.location === "string" ? body.location.trim() || null : null;
  }
  if (body.bio !== undefined) {
    updates.bio = typeof body.bio === "string" ? body.bio.trim() || null : null;
  }
  if (body.phone !== undefined) {
    updates.phone = typeof body.phone === "string" ? body.phone.trim() || null : null;
  }
  if (body.avatar_url !== undefined) {
    updates.avatar_url = typeof body.avatar_url === "string" ? body.avatar_url.trim() || null : null;
  }
  if (body.seo_title !== undefined) {
    updates.seo_title = typeof body.seo_title === "string" ? body.seo_title.trim() || null : null;
  }
  if (body.seo_description !== undefined) {
    updates.seo_description =
      typeof body.seo_description === "string" ? body.seo_description.trim() || null : null;
  }

  if (body.template_id !== undefined) {
    const tid = typeof body.template_id === "string" ? body.template_id : "";
    if (!ALLOWED_TEMPLATES.has(tid)) {
      return NextResponse.json({ ok: false, error: "Invalid template." }, { status: 400 });
    }
    updates.template_id = tid;
  }

  if (body.is_published !== undefined) {
    if (typeof body.is_published !== "boolean") {
      return NextResponse.json({ ok: false, error: "is_published must be boolean." }, { status: 400 });
    }
    updates.is_published = body.is_published;
  }

  const oldSlug = profile.slug;
  let newSlug = oldSlug;

  if (body.slug !== undefined) {
    const slug = normalizeSlug(String(body.slug));
    const err = validateSlugFormat(slug);
    if (err) {
      return NextResponse.json({ ok: false, error: err }, { status: 400 });
    }
    if (slug !== oldSlug) {
      const { data: taken } = await admin.from("platform_users").select("id").eq("slug", slug).maybeSingle();
      if (taken && taken.id !== user.id) {
        return NextResponse.json({ ok: false, error: "That slug is already taken." }, { status: 409 });
      }
      updates.slug = slug;
      newSlug = slug;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: false, error: "No valid fields to update." }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { error } = await admin.from("platform_users").update(updates).eq("id", user.id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  revalidatePath(`/u/${oldSlug}`);
  revalidatePath(`/u/${oldSlug}/work`);
  revalidatePath(`/u/${oldSlug}/about`);
  revalidatePath(`/u/${oldSlug}/contact`);
  revalidatePath(`/u/${newSlug}`);
  revalidatePath(`/u/${newSlug}/work`);
  revalidatePath(`/u/${newSlug}/about`);
  revalidatePath(`/u/${newSlug}/contact`);
  revalidatePath(`/dashboard/${newSlug}`);
  revalidatePath(`/dashboard/${newSlug}/user`);
  revalidatePath(`/dashboard/${newSlug}/site`);
  revalidatePath(`/dashboard/${newSlug}/contact`);
  revalidatePath(`/dashboard/${newSlug}/settings`);
  if (newSlug !== oldSlug) {
    revalidatePath(`/dashboard/${oldSlug}`);
    revalidatePath(`/dashboard/${oldSlug}/user`);
    revalidatePath(`/dashboard/${oldSlug}/site`);
    revalidatePath(`/dashboard/${oldSlug}/contact`);
    revalidatePath(`/dashboard/${oldSlug}/settings`);
  }

  return NextResponse.json({ ok: true, slug: newSlug });
}
