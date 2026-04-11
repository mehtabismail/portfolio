/** Very small HTML → plain text for excerpts (not security-grade sanitization). */
export function stripHtmlToText(html: string | undefined | null, maxLen = 8000): string | null {
  if (!html?.trim()) return null;
  const noTags = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!noTags) return null;
  return noTags.length > maxLen ? `${noTags.slice(0, maxLen)}…` : noTags;
}
