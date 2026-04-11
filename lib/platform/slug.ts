const RESERVED = new Set([
  "admin",
  "api",
  "login",
  "signup",
  "create",
  "dashboard",
  "u",
  "work",
  "about",
  "contact",
  "blogs",
  "_next",
  "static",
  "favicon",
]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateSlugFormat(slug: string): string | null {
  const s = slug.trim().toLowerCase();
  if (s.length < 2) return "Slug must be at least 2 characters.";
  if (s.length > 40) return "Slug must be at most 40 characters.";
  if (!SLUG_RE.test(s)) return "Use lowercase letters, numbers, and single hyphens only.";
  if (RESERVED.has(s)) return "This slug is reserved.";
  return null;
}

export function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

const PROJECT_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Project URL segment under `/u/{portfolio}/work/{projectSlug}` — no reserved list. */
export function validateProjectSlug(slug: string): string | null {
  const s = slug.trim().toLowerCase();
  if (s.length < 1) return "Project slug is required.";
  if (s.length > 80) return "Project slug is too long.";
  if (!PROJECT_SLUG_RE.test(s)) {
    return "Use lowercase letters, numbers, and single hyphens only.";
  }
  return null;
}
