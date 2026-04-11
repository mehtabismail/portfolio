import type { ContactContent, SiteContent, UserData } from "@/data";
import { user as seedUser } from "@/data";
import { contactContent as seedContact } from "@/data/contact";
import { siteContent as seedSite } from "@/data/site";
import { parseContactPayload, parseSitePayload, parseUserPayload } from "@/lib/admin/schemas";
import type { PlatformUserRow } from "@/lib/supabase/types";

function splitDisplayName(displayName: string): { firstName: string; lastName: string } {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length <= 1) return { firstName: parts[0] ?? "", lastName: "" };
  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
}

/** CMS editor starting value when JSON column is empty (legacy row). */
export function defaultTenantCmsUser(profile: PlatformUserRow): UserData {
  const { firstName, lastName } = splitDisplayName(profile.display_name);
  return parseUserPayload({
    ...seedUser,
    firstName,
    lastName,
    fullName: profile.display_name,
    legalName: profile.display_name,
    role: profile.role?.trim() || seedUser.role,
    email: profile.email?.trim() || seedUser.email,
    avatarUrl: profile.avatar_url?.trim() || seedUser.avatarUrl,
    location: profile.location?.trim() || seedUser.location,
    phoneRaw: profile.phone?.trim() || seedUser.phoneRaw,
    phoneDisplay: profile.phone?.trim() || seedUser.phoneDisplay,
    site: {
      title: profile.seo_title?.trim() || `${profile.display_name} — Portfolio`,
      description: profile.seo_description?.trim() || seedUser.site.description,
    },
  });
}

export function defaultTenantCmsSite(): SiteContent {
  return parseSitePayload(structuredClone(seedSite));
}

export function defaultTenantCmsContact(): ContactContent {
  return parseContactPayload(structuredClone(seedContact));
}
