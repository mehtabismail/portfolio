import type { SupabaseClient } from "@supabase/supabase-js";
import { estimateReadTimeMins } from "@/lib/platform/blog-read-time";

export type ExternalPostInput = {
  slug: string;
  title: string;
  content: string | null;
  external_url: string;
  published_at: string | null;
  source: "medium" | "devto";
};

export async function upsertImportedBlogPosts(
  admin: SupabaseClient,
  userId: string,
  posts: ExternalPostInput[],
): Promise<number> {
  const now = new Date().toISOString();
  let count = 0;

  for (const p of posts) {
    const readMins = estimateReadTimeMins(p.content ?? "");
    const { data: existing } = await admin
      .from("blogs")
      .select("id, view_count")
      .eq("user_id", userId)
      .eq("slug", p.slug)
      .maybeSingle();

    if (existing) {
      const { error } = await admin
        .from("blogs")
        .update({
          title: p.title,
          content: p.content,
          external_url: p.external_url,
          published_at: p.published_at,
          read_time_mins: readMins,
          status: "published",
          source: p.source,
          updated_at: now,
        })
        .eq("id", existing.id);
      if (!error) count++;
    } else {
      const { error } = await admin.from("blogs").insert({
        user_id: userId,
        slug: p.slug,
        title: p.title,
        content: p.content,
        cover_image_url: null,
        tags: [],
        status: "published",
        source: p.source,
        external_url: p.external_url,
        view_count: 0,
        read_time_mins: readMins,
        published_at: p.published_at,
        updated_at: now,
      });
      if (!error) count++;
    }
  }

  return count;
}

export async function upsertIntegrationRecord(
  admin: SupabaseClient,
  userId: string,
  provider: "medium" | "devto",
  username: string,
): Promise<void> {
  const row = {
    user_id: userId,
    provider,
    username: username.trim().replace(/^@/, ""),
    is_active: true,
    last_synced_at: new Date().toISOString(),
  };
  const { error } = await admin.from("integrations").upsert(row, { onConflict: "user_id,provider" });
  if (error) throw new Error(error.message);
}
