import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabasePublicClient } from "../server";
import type { PlatformUserRow } from "../types";

const PLATFORM_USER_PUBLIC_FIELDS =
  "id, slug, display_name, role, location, email, phone, avatar_url, bio, template_id, is_published, seo_title, seo_description, cms_user, cms_site, cms_contact, created_at, updated_at" as const;

const PLATFORM_USER_PUBLIC_FIELDS_LEGACY =
  "id, slug, display_name, role, location, email, phone, avatar_url, bio, template_id, is_published, seo_title, seo_description, created_at, updated_at" as const;

function isMissingCmsColumnError(message: string): boolean {
  return message.includes("cms_user") || message.includes("cms_site") || message.includes("does not exist");
}

function nullCms(row: Record<string, unknown>): PlatformUserRow {
  return { ...row, cms_user: null, cms_site: null, cms_contact: null } as unknown as PlatformUserRow;
}

export async function getPublishedUserBySlug(
  slug: string,
  client: SupabaseClient = createSupabasePublicClient(),
): Promise<PlatformUserRow | null> {
  let { data, error } = await client
    .from("platform_users")
    .select(PLATFORM_USER_PUBLIC_FIELDS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error && isMissingCmsColumnError(error.message)) {
    const second = await client
      .from("platform_users")
      .select(PLATFORM_USER_PUBLIC_FIELDS_LEGACY)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (second.error) throw new Error(second.error.message);
    if (!second.data) return null;
    return nullCms(second.data as unknown as Record<string, unknown>);
  }
  if (error) throw new Error(error.message);
  return data as PlatformUserRow | null;
}

export async function listPublishedPortfolioSlugs(
  client: SupabaseClient = createSupabasePublicClient(),
): Promise<string[]> {
  const { data, error } = await client
    .from("platform_users")
    .select("slug")
    .eq("is_published", true);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row: { slug: string }) => row.slug);
}

export async function getAuthenticatedPlatformUser(
  client: SupabaseClient,
): Promise<PlatformUserRow | null> {
  const { data: authData, error: authError } = await client.auth.getUser();
  if (authError || !authData.user) return null;

  let { data, error } = await client
    .from("platform_users")
    .select(PLATFORM_USER_PUBLIC_FIELDS)
    .eq("id", authData.user.id)
    .maybeSingle();

  if (error && isMissingCmsColumnError(error.message)) {
    const second = await client
      .from("platform_users")
      .select(PLATFORM_USER_PUBLIC_FIELDS_LEGACY)
      .eq("id", authData.user.id)
      .maybeSingle();
    if (second.error) throw new Error(second.error.message);
    if (!second.data) return null;
    return nullCms(second.data as unknown as Record<string, unknown>);
  }
  if (error) throw new Error(error.message);
  return data as PlatformUserRow | null;
}
