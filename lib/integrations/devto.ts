import { importArticleSlug } from "./import-slug";

export type DevtoFeedItem = {
  slug: string;
  title: string;
  content: string | null;
  external_url: string;
  published_at: string | null;
};

type DevtoApiArticle = {
  id: number;
  title?: string;
  url?: string;
  canonical_url?: string;
  published_at?: string;
  body_markdown?: string;
  description?: string;
};

export async function fetchDevtoArticles(username: string): Promise<DevtoFeedItem[]> {
  const handle = username.trim().replace(/^@/, "").toLowerCase();
  if (!handle) return [];

  const url = `https://dev.to/api/articles?username=${encodeURIComponent(handle)}&per_page=50`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "PortfolioPlatform/1.0",
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Dev.to API returned ${res.status}. Check the username.`);
  }

  const articles = (await res.json()) as DevtoApiArticle[];
  if (!Array.isArray(articles)) return [];

  const out: DevtoFeedItem[] = [];
  for (const a of articles) {
    const link = (a.canonical_url ?? a.url)?.trim();
    if (!link) continue;
    const title = (a.title ?? "Untitled").trim();
    const slug = importArticleSlug("d", `devto:${a.id}`);
    const md = typeof a.body_markdown === "string" ? a.body_markdown.trim() : "";
    const fallback = typeof a.description === "string" ? a.description.trim() : "";
    const raw = md || fallback;
    const content = raw ? (raw.length > 12000 ? `${raw.slice(0, 12000)}…` : raw) : null;
    const published_at = a.published_at ? new Date(a.published_at).toISOString() : null;
    out.push({
      slug,
      title,
      content,
      external_url: link,
      published_at,
    });
  }

  return out;
}
