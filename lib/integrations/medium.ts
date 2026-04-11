import Parser from "rss-parser";
import { importArticleSlug } from "./import-slug";
import { stripHtmlToText } from "./strip-html";

export type MediumFeedItem = {
  slug: string;
  title: string;
  content: string | null;
  external_url: string;
  published_at: string | null;
};

const parser = new Parser({
  customFields: {
    item: [["content:encoded", "contentEncoded"]],
  },
});

function itemGuid(item: Parser.Item): string {
  const g = item.guid;
  if (typeof g === "string" && g.trim()) return g.trim();
  if (g && typeof g === "object" && "#text" in g && typeof (g as { "#text": string })["#text"] === "string") {
    return (g as { "#text": string })["#text"].trim();
  }
  return item.link ?? item.title ?? "";
}

export async function fetchMediumFeedItems(username: string): Promise<MediumFeedItem[]> {
  const handle = username.trim().replace(/^@/, "");
  if (!handle) return [];

  const url = `https://medium.com/feed/@${encodeURIComponent(handle)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "PortfolioPlatform/1.0 (RSS sync)",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Medium feed returned ${res.status}. Check the username and that the feed is public.`);
  }

  const xml = await res.text();
  const feed = await parser.parseString(xml);

  const out: MediumFeedItem[] = [];
  for (const item of feed.items ?? []) {
    const link = item.link?.trim();
    if (!link) continue;
    const title = (item.title ?? "Untitled").trim();
    const guid = itemGuid(item);
    const slug = importArticleSlug("m", `${guid}|${link}`);
    const raw =
      (item as { contentSnippet?: string }).contentSnippet ??
      (item as { contentEncoded?: string }).contentEncoded ??
      item.content ??
      item.summary;
    const content = stripHtmlToText(typeof raw === "string" ? raw : null, 12000);
    const pub = item.pubDate ? new Date(item.pubDate).toISOString() : null;
    out.push({
      slug,
      title,
      content,
      external_url: link,
      published_at: pub,
    });
  }

  return out;
}
