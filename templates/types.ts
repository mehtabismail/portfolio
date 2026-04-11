/** Canonical payload for all portfolio templates (`/u/[slug]`). */

export type ProjectData = {
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
  is_featured: boolean;
  display_order: number;
};

export type SocialLinkData = {
  platform: string;
  url: string;
  label: string;
  display_order: number;
};

export type SkillData = {
  name: string;
  category: string | null;
  level: number | null;
  display_order: number;
};

export type ExperienceData = {
  company: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  display_order: number;
};

export type BlogData = {
  slug: string;
  title: string;
  content: string | null;
  cover_image_url: string | null;
  tags: string[];
  source: string;
  external_url: string | null;
  view_count: number;
  read_time_mins: number | null;
  published_at: string | null;
};

export type UserPortfolioData = {
  id: string;
  slug: string;
  display_name: string;
  role: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  seo_title: string | null;
  seo_description: string | null;
  template_id: string;
  /** Full JSON blobs (same shape as owner `/admin` editors) when seeded or edited in dashboard CMS. */
  cms_user?: unknown | null;
  cms_site?: unknown | null;
  cms_contact?: unknown | null;
  projects: ProjectData[];
  social_links: SocialLinkData[];
  skills: SkillData[];
  experiences: ExperienceData[];
  blogs: BlogData[];
};

export type TemplateView =
  | "home"
  | "work"
  | "project"
  | "about"
  | "contact"
  | "blogs"
  | "blog";

export type TemplateProps = {
  data: UserPortfolioData;
  view?: TemplateView;
  /** When view is `"project"` — resolved project for this slug. */
  activeProject?: ProjectData | null;
  /** When view is `"blog"` — resolved post for `blogSlug`. */
  activeBlog?: BlogData | null;
};
