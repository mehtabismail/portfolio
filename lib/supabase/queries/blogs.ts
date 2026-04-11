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

const BLOG_DASHBOARD_LIST =
  "id, slug, title, status, source, published_at, updated_at, view_count" as const;

export type DashboardBlogListRow = Pick<
  BlogRow,
  "id" | "slug" | "title" | "status" | "source" | "published_at" | "updated_at" | "view_count"
>;

export async function listDashboardBlogsForUser(
  userId: string,
  supabase: SupabaseClient,
): Promise<DashboardBlogListRow[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_DASHBOARD_LIST)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as DashboardBlogListRow[];
}

const BLOG_OWNER_EDIT_FIELDS =
  "id, user_id, slug, title, content, cover_image_url, tags, status, source, external_url, view_count, read_time_mins, published_at, created_at, updated_at" as const;

export async function getBlogRowForOwner(
  userId: string,
  blogSlug: string,
  supabase: SupabaseClient,
): Promise<BlogRow | null> {
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_OWNER_EDIT_FIELDS)
    .eq("user_id", userId)
    .eq("slug", blogSlug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as BlogRow | null;
}

export type DiscoveryBlog = {
  blog_slug: string;
  title: string;
  published_at: string | null;
  view_count: number;
  read_time_mins: number | null;
  tags: string[];
  author_slug: string;
  author_display_name: string;
};

type BlogDiscoveryJoinRow = {
  slug: string;
  title: string;
  published_at: string | null;
  view_count: number;
  read_time_mins: number | null;
  tags: string[];
  platform_users: { slug: string; display_name: string } | { slug: string; display_name: string }[] | null;
};

function normalizeAuthor(
  rel: BlogDiscoveryJoinRow["platform_users"],
): { slug: string; display_name: string } | null {
  if (!rel) return null;
  return Array.isArray(rel) ? rel[0] ?? null : rel;
}

export async function listPublishedBlogsForDiscovery(
  client: SupabaseClient,
  options: { limit: number; sort: "latest" | "popular" },
): Promise<DiscoveryBlog[]> {
  const limit = Math.min(Math.max(options.limit, 1), 100);
  const order =
    options.sort === "popular"
      ? { column: "view_count" as const, ascending: false }
      : { column: "published_at" as const, ascending: false };

  const { data, error } = await client
    .from("blogs")
    .select("slug, title, published_at, view_count, read_time_mins, tags, platform_users(slug, display_name)")
    .eq("status", "published")
    .order(order.column, { ascending: order.ascending, nullsFirst: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  const out: DiscoveryBlog[] = [];
  for (const row of (data ?? []) as BlogDiscoveryJoinRow[]) {
    const author = normalizeAuthor(row.platform_users);
    if (!author) continue;
    out.push({
      blog_slug: row.slug,
      title: row.title,
      published_at: row.published_at,
      view_count: row.view_count,
      read_time_mins: row.read_time_mins,
      tags: row.tags ?? [],
      author_slug: author.slug,
      author_display_name: author.display_name,
    });
  }
  return out;
}
