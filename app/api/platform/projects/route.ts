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

export async function POST(request: Request) {
  const auth = await requirePlatformApiUser();
  if (!auth.ok) return auth.response;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slugErr = validateProjectSlug(slug);
  if (slugErr) {
    return NextResponse.json({ ok: false, error: slugErr }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ ok: false, error: "Title is required." }, { status: 400 });
  }

  const { profile, admin } = auth;

  const { data: existing } = await admin
    .from("projects")
    .select("id")
    .eq("user_id", profile.id)
    .eq("slug", slug)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ ok: false, error: "You already have a project with this slug." }, { status: 409 });
  }

  const { data: orderRow } = await admin
    .from("projects")
    .select("display_order")
    .eq("user_id", profile.id)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = typeof orderRow?.display_order === "number" ? orderRow.display_order + 1 : 0;

  const row = {
    user_id: profile.id,
    slug,
    title,
    title_display: typeof body.title_display === "string" ? body.title_display.trim() || null : null,
    description: typeof body.description === "string" ? body.description.trim() || null : null,
    services: typeof body.services === "string" ? body.services.trim() || null : null,
    tech_stack: Array.isArray(body.tech_stack) ? body.tech_stack : [],
    categories: Array.isArray(body.categories) ? body.categories : [],
    thumbnail_url: typeof body.thumbnail_url === "string" ? body.thumbnail_url.trim() || null : null,
    thumbnail_bg: typeof body.thumbnail_bg === "string" ? body.thumbnail_bg.trim() || null : null,
    hero_image_url: typeof body.hero_image_url === "string" ? body.hero_image_url.trim() || null : null,
    gallery: Array.isArray(body.gallery) ? body.gallery : [],
    live_url: typeof body.live_url === "string" ? body.live_url.trim() || null : null,
    year: typeof body.year === "string" ? body.year.trim() || null : null,
    role: typeof body.role === "string" ? body.role.trim() || null : null,
    credits: typeof body.credits === "string" ? body.credits.trim() || null : null,
    is_published: typeof body.is_published === "boolean" ? body.is_published : false,
    is_featured: typeof body.is_featured === "boolean" ? body.is_featured : false,
    display_order: typeof body.display_order === "number" ? body.display_order : nextOrder,
  };

  const { error } = await admin.from("projects").insert(row);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const pub = profile.slug;
  revalidatePath(`/u/${pub}`);
  revalidatePath(`/u/${pub}/work`);
  revalidatePath(`/u/${pub}/work/${slug}`);

  return NextResponse.json({ ok: true, slug });
}
