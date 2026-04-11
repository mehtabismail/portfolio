import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  BlogData,
  ExperienceData,
  ProjectData,
  SkillData,
  SocialLinkData,
  UserPortfolioData,
} from "@/templates/types";
import { createSupabasePublicClient } from "../server";
import type { BlogRow, ExperienceRow, ProjectRow, SkillRow, SocialLinkRow } from "../types";
import { getPublishedBlogForPortfolio, getPublishedBlogsForUser } from "./blogs";
import { getPublishedProjectBySlugs, getPublishedProjectsForUser } from "./projects";
import { getPublishedUserBySlug } from "./users";

const SOCIAL_FIELDS = "platform, url, label, display_order" as const;
const SKILL_FIELDS = "name, category, level, display_order" as const;
const EXPERIENCE_FIELDS = "company, role, start_date, end_date, description, display_order" as const;

function mapProject(row: ProjectRow): ProjectData {
  return {
    slug: row.slug,
    title: row.title,
    title_display: row.title_display,
    description: row.description,
    services: row.services,
    tech_stack: row.tech_stack ?? [],
    categories: row.categories ?? [],
    thumbnail_url: row.thumbnail_url,
    thumbnail_bg: row.thumbnail_bg,
    hero_image_url: row.hero_image_url,
    gallery: row.gallery ?? [],
    live_url: row.live_url,
    year: row.year,
    role: row.role,
    credits: row.credits,
    is_featured: row.is_featured,
    display_order: row.display_order,
  };
}

function mapBlog(row: BlogRow): BlogData {
  return {
    slug: row.slug,
    title: row.title,
    content: row.content,
    cover_image_url: row.cover_image_url,
    tags: row.tags ?? [],
    source: row.source,
    external_url: row.external_url,
    view_count: row.view_count,
    read_time_mins: row.read_time_mins,
    published_at: row.published_at,
  };
}

function mapSocial(row: SocialLinkRow): SocialLinkData {
  return {
    platform: row.platform,
    url: row.url,
    label: row.label,
    display_order: row.display_order,
  };
}

function mapSkill(row: SkillRow): SkillData {
  return {
    name: row.name,
    category: row.category,
    level: row.level,
    display_order: row.display_order,
  };
}

function mapExperience(row: ExperienceRow): ExperienceData {
  return {
    company: row.company,
    role: row.role,
    start_date: row.start_date,
    end_date: row.end_date,
    description: row.description,
    display_order: row.display_order,
  };
}

async function getPublishedSocialLinksForUser(
  userId: string,
  client: SupabaseClient,
): Promise<SocialLinkData[]> {
  const { data, error } = await client
    .from("social_links")
    .select(SOCIAL_FIELDS)
    .eq("user_id", userId)
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapSocial(row as SocialLinkRow));
}

async function getPublishedSkillsForUser(userId: string, client: SupabaseClient): Promise<SkillData[]> {
  const { data, error } = await client
    .from("skills")
    .select(SKILL_FIELDS)
    .eq("user_id", userId)
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapSkill(row as SkillRow));
}

async function getPublishedExperiencesForUser(
  userId: string,
  client: SupabaseClient,
): Promise<ExperienceData[]> {
  const { data, error } = await client
    .from("experiences")
    .select(EXPERIENCE_FIELDS)
    .eq("user_id", userId)
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapExperience(row as ExperienceRow));
}

async function loadPublishedPortfolioBySlug(slug: string): Promise<UserPortfolioData | null> {
  const client = createSupabasePublicClient();
  const user = await getPublishedUserBySlug(slug, client);
  if (!user) return null;

  const [projects, blogs, social_links, skills, experiences] = await Promise.all([
    getPublishedProjectsForUser(user.id, client),
    getPublishedBlogsForUser(user.id, client),
    getPublishedSocialLinksForUser(user.id, client),
    getPublishedSkillsForUser(user.id, client),
    getPublishedExperiencesForUser(user.id, client),
  ]);

  return {
    id: user.id,
    slug: user.slug,
    display_name: user.display_name,
    role: user.role,
    location: user.location,
    email: user.email,
    phone: user.phone,
    avatar_url: user.avatar_url,
    bio: user.bio,
    seo_title: user.seo_title,
    seo_description: user.seo_description,
    template_id: user.template_id,
    cms_user: user.cms_user ?? null,
    cms_site: user.cms_site ?? null,
    cms_contact: user.cms_contact ?? null,
    projects: projects.map(mapProject),
    blogs: blogs.map(mapBlog),
    social_links,
    skills,
    experiences,
  };
}

/** Dedupes within a single request (e.g. layout + page). */
export const getPublishedPortfolioBySlug = cache(loadPublishedPortfolioBySlug);

export async function getPublishedProjectDataBySlugs(
  portfolioSlug: string,
  projectSlug: string,
): Promise<ProjectData | null> {
  const row = await getPublishedProjectBySlugs(portfolioSlug, projectSlug);
  if (!row) return null;
  return mapProject(row);
}

export async function getPublishedBlogDataBySlugs(
  portfolioSlug: string,
  blogSlug: string,
): Promise<BlogData | null> {
  const row = await getPublishedBlogForPortfolio(portfolioSlug, blogSlug);
  if (!row) return null;
  return mapBlog(row);
}
