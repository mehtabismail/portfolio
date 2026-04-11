/** Rough reading time from markdown/plain text (words per minute). */
export function estimateReadTimeMins(text: string | null | undefined, wpm = 200): number | null {
  if (!text?.trim()) return null;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / wpm));
}
