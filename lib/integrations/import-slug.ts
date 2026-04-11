import { createHash } from "node:crypto";

/** Stable URL segment for imported posts (unique per external id, valid for `blogs.slug`). */
export function importArticleSlug(prefix: "m" | "d", stableId: string): string {
  const h = createHash("sha256").update(stableId).digest("hex").slice(0, 22);
  return `${prefix}-${h}`;
}
