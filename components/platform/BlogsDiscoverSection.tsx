"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Post = {
  blog_slug: string;
  title: string;
  published_at: string | null;
  author_slug: string;
  author_display_name: string;
  view_count: number;
};

export default function BlogsDiscoverSection() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/platform/blogs/discovery?limit=8&sort=latest", { credentials: "omit" });
        const json = (await res.json()) as { ok?: boolean; posts?: Post[]; error?: string };
        if (!res.ok || !json.ok || !json.posts) {
          throw new Error(json.error || "Could not load community posts.");
        }
        if (!cancelled) setPosts(json.posts);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Could not load posts.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="main-wrap" data-scroll-container>
      <section className="section work-footer work-footer-change-js theme-dark once-in" data-scroll-section>
        <div className="container medium">
          <div className="row">
            <div className="flex-col">
              <h2 style={{ margin: 0, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600 }}>
                From the community
              </h2>
              <p style={{ margin: "0.75rem 0 0", opacity: 0.75, maxWidth: "48ch" }}>
                Latest published posts from portfolios on this platform.
              </p>
              {err ? (
                <p style={{ marginTop: "1rem", color: "#fca5a5" }}>{err}</p>
              ) : posts === null ? (
                <p style={{ marginTop: "1.25rem", opacity: 0.6 }}>Loading…</p>
              ) : posts.length === 0 ? (
                <p style={{ marginTop: "1.25rem", opacity: 0.6 }}>No public posts yet.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: "1.5rem 0 0" }}>
                  {posts.map((p) => (
                    <li
                      key={`${p.author_slug}-${p.blog_slug}`}
                      style={{
                        padding: "0.85rem 0",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <Link
                        href={`/u/${p.author_slug}/blogs/${p.blog_slug}`}
                        style={{ color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: "1.05rem" }}
                      >
                        {p.title}
                      </Link>
                      <p style={{ margin: "0.35rem 0 0", fontSize: "0.875rem", opacity: 0.65 }}>
                        {p.author_display_name}
                        {p.published_at
                          ? ` · ${new Date(p.published_at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}`
                          : null}{" "}
                        · {p.view_count} views
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <p style={{ marginTop: "1.5rem" }}>
                <Link href="/blogs" className="btn btn-link" style={{ color: "#fff" }}>
                  <span className="btn-text">
                    <span className="btn-text-inner">Browse all posts →</span>
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
