import Link from "next/link";
import { requireDashboard } from "@/lib/platform/dashboard-context";
import { listDashboardBlogsForUser, type DashboardBlogListRow } from "@/lib/supabase/queries/blogs";

export default async function DashboardBlogsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, profile } = await requireDashboard(slug);

  let posts: DashboardBlogListRow[] = [];
  try {
    posts = await listDashboardBlogsForUser(profile.id, supabase);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return <p className="admin-msg--err">Could not load posts: {message}</p>;
  }

  return (
    <>
      <div className="admin-list-head">
        <h1 className="admin-page-title">Blog</h1>
        <Link className="admin-link" href={`/dashboard/${slug}/blogs/new`}>
          + New post
        </Link>
      </div>
      <p className="admin-page-lead admin-page-lead--tight">
        Drafts and published posts for your public blog at <strong>/u/{slug}/blogs</strong>.
      </p>

      {posts.length === 0 ? (
        <div className="admin-card">
          <p className="admin-card__help">
            No posts yet.{" "}
            <Link className="admin-link" href={`/dashboard/${slug}/blogs/new`}>
              Write one
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="admin-card admin-card--list">
          <div className="admin-stack">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/dashboard/${slug}/blogs/${post.slug}`}
                className="admin-project-row"
              >
                <div>
                  <strong>{post.title}</strong>
                  <span className="admin-project-row__slug">{post.slug}</span>
                </div>
                <div className="admin-project-row__badges">
                  <span className="admin-project-row__meta">{post.source}</span>
                  {post.status === "draft" ? (
                    <span className="admin-badge admin-badge--draft">Draft</span>
                  ) : post.status === "archived" ? (
                    <span className="admin-badge admin-badge--draft">Archived</span>
                  ) : (
                    <span className="admin-badge">Published</span>
                  )}
                  <span className="admin-project-row__meta">{post.view_count} views</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
