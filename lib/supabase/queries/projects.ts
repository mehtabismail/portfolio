import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabasePublicClient } from "../server";
import type { ProjectRow } from "../types";

const PROJECT_PUBLIC_FIELDS =
  "id, user_id, slug, title, title_display, description, services, tech_stack, categories, thumbnail_url, thumbnail_bg, hero_image_url, gallery, live_url, year, role, credits, is_published, is_featured, display_order, created_at, updated_at" as const;

export async function getPublishedProjectsForUser(
  userId: string,
  client: SupabaseClient = createSupabasePublicClient(),
): Promise<ProjectRow[]> {
  const { data, error } = await client
    .from("projects")
    .select(PROJECT_PUBLIC_FIELDS)
    .eq("user_id", userId)
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as ProjectRow[];
}

export async function getPublishedProjectBySlugs(
  portfolioSlug: string,
  projectSlug: string,
  client: SupabaseClient = createSupabasePublicClient(),
): Promise<ProjectRow | null> {
  const { data: userRow, error: userError } = await client
    .from("platform_users")
    .select("id")
    .eq("slug", portfolioSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (userError) throw new Error(userError.message);
  if (!userRow) return null;

  const { data, error } = await client
    .from("projects")
    .select(PROJECT_PUBLIC_FIELDS)
    .eq("user_id", userRow.id)
    .eq("slug", projectSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as ProjectRow | null;
}
