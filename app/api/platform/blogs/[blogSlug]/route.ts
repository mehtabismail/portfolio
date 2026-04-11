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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ blogSlug: string }> },
) {
  const auth = await requirePlatformApiUser();
  if (!auth.ok) return auth.response;

  const { blogSlug: routeSlug } = await context.params;
  const { profile, admin } = auth;

  const { data: current, error: loadErr } = await admin
    .from("blogs")
    .select("id, slug, status, source, published_at, title, content")
    .eq("user_id", profile.id)
    .eq("slug", routeSlug)
    .maybeSingle();
  if (loadErr || !current) {
    return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
  }
  if (current.source !== "platform") {
    return NextResponse.json(
      { ok: false, error: "Imported posts cannot be edited in the dashboard." },
      { status: 400 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  let newSlug = current.slug as string;

  let mergedTitle = (current.title as string) ?? "";
  let mergedContent = (current.content as string | null) ?? null;

  if (body.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) return NextResponse.json({ ok: false, error: "Title is required." }, { status: 400 });
    updates.title = title;
    mergedTitle = title;
  }
  if (body.content !== undefined) {
    const c = typeof body.content === "string" ? body.content : null;
    updates.content = c;
    mergedContent = c;
  }
  if (body.cover_image_url !== undefined) {
    updates.cover_image_url =
      typeof body.cover_image_url === "string" && body.cover_image_url.trim()
        ? body.cover_image_url.trim()
        : null;
  }
  if (body.tags !== undefined) {
    updates.tags = parseTags(body.tags);
  }
  if (body.status !== undefined) {
    if (body.status !== "draft" && body.status !== "published" && body.status !== "archived") {
      return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
    }
    updates.status = body.status;
    if (body.status === "published" && !current.published_at) {
      updates.published_at = new Date().toISOString();
    }
    if (body.status !== "published") {
      /* keep published_at for history */
    }
  }

  if (body.slug !== undefined) {
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const err = validateProjectSlug(slug);
    if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });
    if (slug !== current.slug) {
      const { data: clash } = await admin
        .from("blogs")
        .select("id")
        .eq("user_id", profile.id)
        .eq("slug", slug)
        .maybeSingle();
      if (clash) {
        return NextResponse.json({ ok: false, error: "You already have a post with this slug." }, { status: 409 });
      }
      updates.slug = slug;
      newSlug = slug;
    }
  }

  if (body.title !== undefined || body.content !== undefined) {
    updates.read_time_mins = estimateReadTimeMins(`${mergedTitle}\n\n${mergedContent ?? ""}`);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: false, error: "No valid fields to update." }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { error } = await admin.from("blogs").update(updates).eq("id", current.id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const pub = profile.slug;
  revalidatePath(`/u/${pub}/blogs`);
  revalidatePath(`/u/${pub}/blogs/${routeSlug}`);
  if (newSlug !== routeSlug) {
    revalidatePath(`/u/${pub}/blogs/${newSlug}`);
  }
  revalidatePath("/blogs");

  return NextResponse.json({ ok: true, slug: newSlug });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ blogSlug: string }> },
) {
  const auth = await requirePlatformApiUser();
  if (!auth.ok) return auth.response;

  const { blogSlug } = await context.params;
  const { profile, admin } = auth;

  const { data: current, error: loadErr } = await admin
    .from("blogs")
    .select("id")
    .eq("user_id", profile.id)
    .eq("slug", blogSlug)
    .maybeSingle();
  if (loadErr || !current) {
    return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
  }

  const { error } = await admin.from("blogs").delete().eq("id", current.id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const pub = profile.slug;
  revalidatePath(`/u/${pub}/blogs`);
  revalidatePath(`/u/${pub}/blogs/${blogSlug}`);
  revalidatePath("/blogs");

  return NextResponse.json({ ok: true });
}
