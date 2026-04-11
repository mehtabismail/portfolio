/** Row shapes for explicit `.select()` results — keep in sync with `supabase/schema.sql`. */

export type PlatformUserRow = {
  id: string;
  slug: string;
  display_name: string;
  role: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  template_id: string;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  cms_user?: unknown | null;
  cms_site?: unknown | null;
  cms_contact?: unknown | null;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  title_display: string | null;
  description: string | null;
  services: string | null;
  tech_stack: string[];
  categories: string[];
  thumbnail_url: string | null;
  thumbnail_bg: string | null;
  hero_image_url: string | null;
  gallery: string[];
  live_url: string | null;
  year: string | null;
  role: string | null;
  credits: string | null;
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type SocialLinkRow = {
  id: string;
  user_id: string;
  platform: string;
  url: string;
  label: string;
  display_order: number;
};

export type SkillRow = {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  level: number | null;
  display_order: number;
};

export type ExperienceRow = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  display_order: number;
};

export type BlogRow = {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  content: string | null;
  cover_image_url: string | null;
  tags: string[];
  status: "draft" | "published" | "archived";
  source: "platform" | "medium" | "devto" | "hashnode";
  external_url: string | null;
  view_count: number;
  read_time_mins: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type IntegrationRow = {
  id: string;
  user_id: string;
  provider: "medium" | "devto" | "hashnode" | "github";
  username: string;
  is_active: boolean;
  last_synced_at: string | null;
};
