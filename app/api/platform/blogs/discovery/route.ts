import { NextResponse } from "next/server";
import { listPublishedBlogsForDiscovery } from "@/lib/supabase/queries/blogs";
import { createSupabasePublicClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitRaw = searchParams.get("limit");
  const sort = searchParams.get("sort") === "popular" ? "popular" : "latest";
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : 12;
  if (Number.isNaN(limit) || limit < 1) {
    return NextResponse.json({ ok: false, error: "Invalid limit." }, { status: 400 });
  }

  try {
    const client = createSupabasePublicClient();
    const posts = await listPublishedBlogsForDiscovery(client, { limit, sort });
    return NextResponse.json({ ok: true, posts });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load posts.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
