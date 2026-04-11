import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { estimateReadTimeMins } from "@/lib/platform/blog-read-time";
import { requirePlatformApiUser } from "@/lib/platform/api-auth";
import { validateProjectSlug } from "@/lib/platform/slug";

type Body = {
  slug?: string;
  title?: string;
  content?: string | null;
  cover_image_url?: string | null;
  tags?: string[];
  status?: "draft" | "published" | "archived";
};

function parseTags(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter(Boolean)
    .slice(0, 24);
}

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

  const status = body.status === "published" || body.status === "archived" ? body.status : "draft";
  const content = typeof body.content === "string" ? body.content : null;
  const cover =
    typeof body.cover_image_url === "string" && body.cover_image_url.trim()
      ? body.cover_image_url.trim()
      : null;
  const tags = parseTags(body.tags);
  const readMins = estimateReadTimeMins(content ?? "");
  const now = new Date().toISOString();
  const publishedAt = status === "published" ? now : null;

  const { profile, admin } = auth;

  const { data: existing } = await admin
    .from("blogs")
    .select("id")
    .eq("user_id", profile.id)
    .eq("slug", slug)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ ok: false, error: "You already have a post with this slug." }, { status: 409 });
  }

  const row = {
    user_id: profile.id,
    slug,
    title,
    content,
    cover_image_url: cover,
    tags,
    status,
    source: "platform" as const,
    external_url: null,
    read_time_mins: readMins,
    published_at: publishedAt,
    updated_at: now,
  };

  const { error } = await admin.from("blogs").insert(row);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const pub = profile.slug;
  revalidatePath(`/u/${pub}/blogs`);
  revalidatePath(`/u/${pub}/blogs/${slug}`);
  revalidatePath("/blogs");

  return NextResponse.json({ ok: true, slug });
}
