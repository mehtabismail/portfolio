import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabasePublicClient } from "../server";
import type { BlogRow } from "../types";
import { getPublishedUserBySlug } from "./users";

const BLOG_PUBLIC_FIELDS =
  "id, user_id, slug, title, content, cover_image_url, tags, status, source, external_url, view_count, read_time_mins, published_at, created_at, updated_at" as const;

export async function getPublishedBlogsForUser(
  userId: string,
  client: SupabaseClient = createSupabasePublicClient(),
): Promise<BlogRow[]> {
  const { data, error } = await client
    .from("blogs")
    .select(BLOG_PUBLIC_FIELDS)
    .eq("user_id", userId)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as BlogRow[];
}

export async function getPublishedBlogForPortfolio(
  portfolioSlug: string,
  blogSlug: string,
  client: SupabaseClient = createSupabasePublicClient(),
): Promise<BlogRow | null> {
  const user = await getPublishedUserBySlug(portfolioSlug, client);
  if (!user) return null;

  const { data, error } = await client
    .from("blogs")
    .select(BLOG_PUBLIC_FIELDS)
    .eq("user_id", user.id)
    .eq("slug", blogSlug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as BlogRow | null;
}
