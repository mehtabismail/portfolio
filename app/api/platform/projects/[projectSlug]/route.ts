import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requirePlatformApiUser } from "@/lib/platform/api-auth";
import { validateProjectSlug } from "@/lib/platform/slug";

type Body = {
  slug?: string;
  title?: string;
  title_display?: string | null;
  description?: string | null;
  services?: string | null;
  tech_stack?: string[];
  categories?: string[];
  thumbnail_url?: string | null;
  thumbnail_bg?: string | null;
  hero_image_url?: string | null;
  gallery?: string[];
  live_url?: string | null;
  year?: string | null;
  role?: string | null;
  credits?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
  display_order?: number;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ projectSlug: string }> },
) {
  const auth = await requirePlatformApiUser();
  if (!auth.ok) return auth.response;

  const { projectSlug: routeSlug } = await context.params;
  const { profile, admin } = auth;

  const { data: current, error: loadErr } = await admin
    .from("projects")
    .select("id, slug")
    .eq("user_id", profile.id)
    .eq("slug", routeSlug)
    .maybeSingle();
  if (loadErr || !current) {
    return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (body.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) return NextResponse.json({ ok: false, error: "Title is required." }, { status: 400 });
    updates.title = title;
  }
  if (body.title_display !== undefined) {
    updates.title_display = typeof body.title_display === "string" ? body.title_display.trim() || null : null;
  }
  if (body.description !== undefined) {
    updates.description = typeof body.description === "string" ? body.description.trim() || null : null;
  }
  if (body.services !== undefined) {
    updates.services = typeof body.services === "string" ? body.services.trim() || null : null;
  }
  if (body.tech_stack !== undefined) {
    updates.tech_stack = Array.isArray(body.tech_stack) ? body.tech_stack : [];
  }
  if (body.categories !== undefined) {
    updates.categories = Array.isArray(body.categories) ? body.categories : [];
  }
  if (body.thumbnail_url !== undefined) {
    updates.thumbnail_url = typeof body.thumbnail_url === "string" ? body.thumbnail_url.trim() || null : null;
  }
  if (body.thumbnail_bg !== undefined) {
    updates.thumbnail_bg = typeof body.thumbnail_bg === "string" ? body.thumbnail_bg.trim() || null : null;
  }
  if (body.hero_image_url !== undefined) {
    updates.hero_image_url = typeof body.hero_image_url === "string" ? body.hero_image_url.trim() || null : null;
  }
  if (body.gallery !== undefined) {
    updates.gallery = Array.isArray(body.gallery) ? body.gallery : [];
  }
  if (body.live_url !== undefined) {
    updates.live_url = typeof body.live_url === "string" ? body.live_url.trim() || null : null;
  }
  if (body.year !== undefined) {
    updates.year = typeof body.year === "string" ? body.year.trim() || null : null;
  }
  if (body.role !== undefined) {
    updates.role = typeof body.role === "string" ? body.role.trim() || null : null;
  }
  if (body.credits !== undefined) {
    updates.credits = typeof body.credits === "string" ? body.credits.trim() || null : null;
  }
  if (body.is_published !== undefined) {
    if (typeof body.is_published !== "boolean") {
      return NextResponse.json({ ok: false, error: "is_published must be boolean." }, { status: 400 });
    }
    updates.is_published = body.is_published;
  }
  if (body.is_featured !== undefined) {
    if (typeof body.is_featured !== "boolean") {
      return NextResponse.json({ ok: false, error: "is_featured must be boolean." }, { status: 400 });
    }
    updates.is_featured = body.is_featured;
  }
  if (body.display_order !== undefined) {
    if (typeof body.display_order !== "number" || Number.isNaN(body.display_order)) {
      return NextResponse.json({ ok: false, error: "display_order must be a number." }, { status: 400 });
    }
    updates.display_order = body.display_order;
  }

  let newSlug = current.slug;
  if (body.slug !== undefined) {
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const err = validateProjectSlug(slug);
    if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });
    if (slug !== current.slug) {
      const { data: clash } = await admin
        .from("projects")
        .select("id")
        .eq("user_id", profile.id)
        .eq("slug", slug)
        .maybeSingle();
      if (clash) {
        return NextResponse.json({ ok: false, error: "You already have a project with this slug." }, { status: 409 });
      }
      updates.slug = slug;
      newSlug = slug;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: false, error: "No valid fields to update." }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { error } = await admin.from("projects").update(updates).eq("id", current.id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const pub = profile.slug;
  revalidatePath(`/u/${pub}`);
  revalidatePath(`/u/${pub}/work`);
  revalidatePath(`/u/${pub}/work/${routeSlug}`);
  if (newSlug !== routeSlug) {
    revalidatePath(`/u/${pub}/work/${newSlug}`);
  }

  return NextResponse.json({ ok: true, slug: newSlug });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ projectSlug: string }> },
) {
  const auth = await requirePlatformApiUser();
  if (!auth.ok) return auth.response;

  const { projectSlug } = await context.params;
  const { profile, admin } = auth;

  const { data: current, error: loadErr } = await admin
    .from("projects")
    .select("id")
    .eq("user_id", profile.id)
    .eq("slug", projectSlug)
    .maybeSingle();
  if (loadErr || !current) {
    return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
  }

  const { error } = await admin.from("projects").delete().eq("id", current.id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const pub = profile.slug;
  revalidatePath(`/u/${pub}`);
  revalidatePath(`/u/${pub}/work`);
  revalidatePath(`/u/${pub}/work/${projectSlug}`);

  return NextResponse.json({ ok: true });
}
