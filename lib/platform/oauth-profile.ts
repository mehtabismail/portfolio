import type { User } from "@supabase/supabase-js";

export type ExtractedOAuthProfile = {
  displayName: string;
  firstName: string;
  lastName: string;
  /** Base string for URL slug (e.g. `john-doe`), not yet uniqueness-checked. */
  slugBase: string;
  avatarUrl: string | null;
  role: string | null;
};

function clean(s: unknown): string {
  return typeof s === "string" ? s.trim() : "";
}

/**
 * Reads Supabase Auth user + Google (or other) identity metadata.
 */
export function extractProfileFromSupabaseUser(user: User): ExtractedOAuthProfile {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const googleIdentity = user.identities?.find((i) => i.provider === "google");
  const idData = (googleIdentity?.identity_data ?? {}) as Record<string, unknown>;
  const data: Record<string, unknown> = { ...idData, ...meta };

  const given = clean(data.given_name);
  const family = clean(data.family_name);
  const fullNameRaw = clean(data.full_name) || clean(data.name);
  const emailLocal = (user.email ?? "").split("@")[0]?.replace(/[.+]/g, " ") ?? "";

  let displayName = fullNameRaw;
  if (!displayName && (given || family)) {
    displayName = `${given} ${family}`.trim();
  }
  if (!displayName) {
    displayName = emailLocal || "Creator";
  }

  let firstName = given;
  let lastName = family;
  if (!firstName && !lastName && displayName) {
    const parts = displayName.split(/\s+/);
    firstName = parts[0] ?? "";
    lastName = parts.slice(1).join(" ");
  }

  const avatarRaw = clean(data.avatar_url) || clean(data.picture);
  const avatarUrl = avatarRaw.length > 0 ? avatarRaw : null;

  const slugPieces = [firstName, lastName].filter(Boolean);
  const slugBase = slugPieces.length ? slugPieces.join(" ") : displayName;

  const role = clean(data.job_title) || null;

  return {
    displayName,
    firstName,
    lastName,
    slugBase,
    avatarUrl,
    role,
  };
}

export function userHasGoogleIdentity(user: User): boolean {
  return user.identities?.some((i) => i.provider === "google") ?? false;
}
