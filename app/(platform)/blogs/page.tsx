import Link from "next/link";
import { listPublishedBlogsForDiscovery } from "@/lib/supabase/queries/blogs";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import styles from "./blogs.module.css";

export const revalidate = 30;

export default async function PlatformBlogsDiscoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const sp = await searchParams;
  const sort = sp.sort === "popular" ? "popular" : "latest";
  const client = createSupabasePublicClient();
  let posts: Awaited<ReturnType<typeof listPublishedBlogsForDiscovery>> = [];
  try {
    posts = await listPublishedBlogsForDiscovery(client, { limit: 48, sort });
  } catch {
    posts = [];
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>Community blog</h1>
          <p className={styles.lead}>Published posts from portfolios on this platform.</p>
          <nav className={styles.tabs} aria-label="Sort posts">
            <Link href="/blogs?sort=latest" className={sort === "latest" ? styles.tabActive : styles.tab}>
              Latest
            </Link>
            <Link href="/blogs?sort=popular" className={sort === "popular" ? styles.tabActive : styles.tab}>
              Popular
            </Link>
          </nav>
        </header>

        {posts.length === 0 ? (
          <p className={styles.empty}>No public posts yet.</p>
        ) : (
          <ul className={styles.list}>
            {posts.map((p) => (
              <li key={`${p.author_slug}-${p.blog_slug}`} className={styles.row}>
                <Link href={`/u/${p.author_slug}/blogs/${p.blog_slug}`} className={styles.postTitle}>
                  {p.title}
                </Link>
                <p className={styles.meta}>
                  {p.author_display_name}
                  {p.published_at
                    ? ` · ${new Date(p.published_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}`
                    : null}
                  {" · "}
                  {p.view_count} views
                  {p.read_time_mins ? ` · ${p.read_time_mins} min read` : null}
                </p>
                {p.tags.length ? (
                  <p className={styles.tags}>
                    {p.tags.map((t) => (
                      <span key={t} className={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <p className={styles.footer}>
          <Link href="/create" className={styles.cta}>
            Create your portfolio
          </Link>
        </p>
      </div>
    </div>
  );
}
