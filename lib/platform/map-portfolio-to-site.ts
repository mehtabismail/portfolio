import type { ContactContent, Project, SiteContent, UserData } from "@/data";
import { contactContent as defaultContactContent } from "@/data/contact";
import { siteContent as defaultSiteContent } from "@/data/site";
import { parseContactPayload, parseSitePayload, parseUserPayload } from "@/lib/admin/schemas";
import type { ProjectData, UserPortfolioData } from "@/templates/types";

const VALID_CATEGORIES = new Set(["design", "development", "interaction"]);

function mapCategories(categories: string[]): Project["categories"] {
  const mapped = categories.filter((c): c is "design" | "development" | "interaction" =>
    VALID_CATEGORIES.has(c),
  );
  return (mapped.length ? mapped : ["design"]) as Project["categories"];
}

function splitDisplayName(displayName: string): { firstName: string; lastName: string } {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length <= 1) return { firstName: parts[0] ?? "", lastName: "" };
  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
}

function splitHeroRole(role: string | null): { prefix: string; suffix: string } {
  if (!role?.trim()) {
    return {
      prefix: defaultSiteContent.home.heroRolePrefix,
      suffix: defaultSiteContent.home.heroRoleSuffix,
    };
  }
  const trimmed = role.trim();
  const match = /^(\S+)\s+(.+)$/.exec(trimmed);
  if (match) return { prefix: match[1]!, suffix: match[2]! };
  return { prefix: "", suffix: trimmed };
}

export function mapProjectDataToProject(row: ProjectData, portfolioLocation: string | null): Project {
  const titleDisplay = row.title_display?.trim() || row.title;
  return {
    slug: row.slug,
    title: row.title,
    titleDisplay,
    isPublished: true,
    isFeatured: row.is_featured,
    location: portfolioLocation?.trim() || "",
    year: row.year ?? "",
    services: row.services ?? "",
    categories: mapCategories(row.categories ?? []),
    thumbnailBg: row.thumbnail_bg || "#F1F1F1",
    thumbnailUrl: row.thumbnail_url || "",
    thumbnailHoverUrl: row.gallery[0] || row.thumbnail_url || undefined,
    heroImageUrl: row.hero_image_url ?? undefined,
    gallery: row.gallery?.length ? row.gallery : undefined,
    role: row.role ?? undefined,
    credits: row.credits ?? undefined,
    liveUrl: row.live_url ?? undefined,
    order: row.display_order,
  };
}

function relationalUser(data: UserPortfolioData): UserData {
  const { firstName, lastName } = splitDisplayName(data.display_name);
  const socials = [...data.social_links]
    .sort((a, b) => a.display_order - b.display_order)
    .map((s) => ({ label: s.label, href: s.url }));

  return {
    avatarUrl: data.avatar_url?.trim() || "/assets/img/Mehtab.jpg",
    firstName,
    lastName,
    fullName: data.display_name,
    legalName: data.display_name,
    role: data.role?.trim() || "",
    location: data.location?.trim() || "—",
    email: data.email?.trim() || "",
    phoneRaw: data.phone?.trim() || "",
    phoneDisplay: data.phone?.trim() || "—",
    coc: "",
    vat: "",
    site: {
      title: data.seo_title?.trim() || `${data.display_name} — Portfolio`,
      description: data.seo_description?.trim() || data.bio?.trim() || `Portfolio of ${data.display_name}`,
    },
    socials,
  };
}

function relationalSiteContent(data: UserPortfolioData): SiteContent {
  const hero = splitHeroRole(data.role);
  const siteContent: SiteContent = JSON.parse(JSON.stringify(defaultSiteContent)) as SiteContent;
  siteContent.home.heroRolePrefix = hero.prefix;
  siteContent.home.heroRoleSuffix = hero.suffix;
  if (data.bio?.trim()) {
    siteContent.home.introDescription = data.bio.trim();
  }
  return siteContent;
}

export type TenantSiteBundle = {
  basePath: string;
  user: UserData;
  siteContent: SiteContent;
  contactContent: ContactContent;
  projects: Project[];
  featuredProjects: Project[];
  totalPublicProjects: number;
};

export function mapPortfolioToSiteModels(data: UserPortfolioData): TenantSiteBundle {
  const basePath = `/u/${data.slug}`;

  let user: UserData;
  if (data.cms_user != null) {
    try {
      user = parseUserPayload(data.cms_user);
    } catch {
      user = relationalUser(data);
    }
  } else {
    user = relationalUser(data);
  }

  let siteContent: SiteContent;
  if (data.cms_site != null) {
    try {
      siteContent = parseSitePayload(data.cms_site);
    } catch {
      siteContent = relationalSiteContent(data);
    }
  } else {
    siteContent = relationalSiteContent(data);
  }

  let contactContent: ContactContent;
  if (data.cms_contact != null) {
    try {
      contactContent = parseContactPayload(data.cms_contact);
    } catch {
      contactContent = structuredClone(defaultContactContent);
    }
  } else {
    contactContent = structuredClone(defaultContactContent);
  }

  const projects = data.projects.map((p) => mapProjectDataToProject(p, data.location));
  const featuredFromFlag = projects
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);
  const featuredProjects =
    featuredFromFlag.length > 0
      ? featuredFromFlag
      : [...projects].sort((a, b) => a.order - b.order).slice(0, 4);

  return {
    basePath,
    user,
    siteContent,
    contactContent,
    projects,
    featuredProjects,
    totalPublicProjects: projects.length,
  };
}
