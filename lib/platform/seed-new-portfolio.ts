import type { SupabaseClient } from "@supabase/supabase-js";
import type { Project } from "@/data";
import { parseContactPayload, parseSitePayload, parseUserPayload } from "@/lib/admin/schemas";
import { projects as seedProjects, user as seedUser } from "@/data";
import { contactContent as seedContact } from "@/data/contact";
import { siteContent as seedSite } from "@/data/site";

function splitDisplayName(displayName: string): { firstName: string; lastName: string } {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length <= 1) return { firstName: parts[0] ?? "", lastName: "" };
  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
}

function socialPlatformFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host.split(".")[0] || "link";
  } catch {
    return "link";
  }
}

function splitHeroForSite(role: string | null): { prefix: string; suffix: string } {
  if (!role?.trim()) {
    return { prefix: seedSite.home.heroRolePrefix, suffix: seedSite.home.heroRoleSuffix };
  }
  const trimmed = role.trim();
  const m = /^(\S+)\s+(.+)$/.exec(trimmed);
  if (m) return { prefix: m[1]!, suffix: m[2]! };
  return { prefix: "", suffix: trimmed };
}

function staticProjectToInsertRow(p: Project, userId: string, index: number) {
  const isFeatured = index < 4 || p.isFeatured === true;
  return {
    user_id: userId,
    slug: p.slug,
    title: p.title,
    title_display: p.titleDisplay,
    description: null as string | null,
    services: p.services,
    tech_stack: [] as string[],
    categories: [...p.categories] as string[],
    thumbnail_url: p.thumbnailUrl,
    thumbnail_bg: p.thumbnailBg,
    hero_image_url: p.heroImageUrl ?? null,
    gallery: p.gallery ?? [],
    live_url: p.liveUrl ?? null,
    year: p.year,
    role: p.role ?? null,
    credits: p.credits ?? null,
    is_published: true,
    is_featured: isFeatured,
    display_order: p.order,
  };
}

export type SeedPortfolioInput = {
  display_name: string;
  role: string | null;
  slug: string;
  email: string | null;
  avatar_url: string | null;
};

/**
 * After `platform_users` row exists: copy demo projects/socials from `data/*`,
 * store CMS JSON (user/site/contact), publish portfolio.
 */
export async function seedNewPortfolioFromDefaults(
  admin: SupabaseClient,
  userId: string,
  input: SeedPortfolioInput,
): Promise<void> {
  const { firstName, lastName } = splitDisplayName(input.display_name);
  const hero = splitHeroForSite(input.role);
  const siteClone = JSON.parse(JSON.stringify(seedSite)) as typeof seedSite;
  siteClone.home.heroRolePrefix = hero.prefix;
  siteClone.home.heroRoleSuffix = hero.suffix;

  const avatar = input.avatar_url?.trim() || seedUser.avatarUrl;

  const userPayload = parseUserPayload({
    ...seedUser,
    firstName,
    lastName,
    fullName: input.display_name,
    legalName: input.display_name,
    role: input.role?.trim() || seedUser.role,
    email: input.email?.trim() || seedUser.email,
    avatarUrl: avatar,
    site: {
      ...seedUser.site,
      title: `${input.display_name} — Portfolio`,
      description: seedUser.site.description,
    },
  });

  const sitePayload = parseSitePayload(siteClone);
  const contactPayload = parseContactPayload(structuredClone(seedContact));

  const demoProjects = seedProjects.filter((p) => p.isPublished !== false).sort((a, b) => a.order - b.order);
  const rows = demoProjects.map((p, index) => staticProjectToInsertRow(p, userId, index));

  const { error: projErr } = await admin.from("projects").insert(rows);
  if (projErr) throw new Error(projErr.message);

  const socialRows = seedUser.socials.map((s, i) => ({
    user_id: userId,
    platform: socialPlatformFromUrl(s.href),
    url: s.href,
    label: s.label,
    display_order: i,
  }));

  const { error: socialErr } = await admin.from("social_links").insert(socialRows);
  if (socialErr) throw new Error(socialErr.message);

  const { error: updErr } = await admin
    .from("platform_users")
    .update({
      location: seedUser.location,
      phone: seedUser.phoneRaw,
      bio: null,
      avatar_url: avatar,
      seo_title: userPayload.site.title,
      seo_description: userPayload.site.description,
      cms_user: userPayload,
      cms_site: sitePayload,
      cms_contact: contactPayload,
      is_published: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updErr) throw new Error(updErr.message);
}
