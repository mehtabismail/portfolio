import { NextResponse } from "next/server";
import { fetchMediumFeedItems } from "@/lib/integrations/medium";
import { requirePlatformApiUser } from "@/lib/platform/api-auth";
import { importedBlogSyncRevalidate } from "@/lib/platform/integration-revalidate";
import { upsertImportedBlogPosts, upsertIntegrationRecord } from "@/lib/platform/imported-blog-sync";

type Body = {
  username?: string;
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

  const username = typeof body.username === "string" ? body.username.trim().replace(/^@/, "") : "";
  if (!username || username.length > 64 || !/^[a-zA-Z0-9._-]+$/.test(username)) {
    return NextResponse.json({ ok: false, error: "Enter a valid Medium username (letters, numbers, dot, underscore)." }, { status: 400 });
  }

  const { profile, admin } = auth;

  try {
    const items = await fetchMediumFeedItems(username);
    const posts = items.map((i) => ({
      slug: i.slug,
      title: i.title,
      content: i.content,
      external_url: i.external_url,
      published_at: i.published_at,
      source: "medium" as const,
    }));
    const imported = await upsertImportedBlogPosts(admin, profile.id, posts);
    await upsertIntegrationRecord(admin, profile.id, "medium", username);
    importedBlogSyncRevalidate(profile.slug);
    return NextResponse.json({ ok: true, imported, totalFromFeed: items.length });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sync failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
