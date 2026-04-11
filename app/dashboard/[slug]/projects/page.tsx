import Link from "next/link";
import { requireDashboard } from "@/lib/platform/dashboard-context";
import type { ProjectRow } from "@/lib/supabase/types";

const PROJECT_LIST =
  "id, slug, title, is_published, is_featured, display_order, thumbnail_url" as const;

export default async function DashboardProjectsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, profile } = await requireDashboard(slug);

  const { data: rows, error } = await supabase
    .from("projects")
    .select(PROJECT_LIST)
    .eq("user_id", profile.id)
    .order("display_order", { ascending: true });

  if (error) {
    return <p className="admin-msg--err">Could not load projects: {error.message}</p>;
  }

  const projects = (rows ?? []) as Pick<
    ProjectRow,
    "id" | "slug" | "title" | "is_published" | "is_featured" | "display_order" | "thumbnail_url"
  >[];

  return (
    <>
      <div className="admin-list-head">
        <h1 className="admin-page-title">Projects</h1>
        <Link className="admin-link" href={`/dashboard/${slug}/projects/new`}>
          + New project
        </Link>
      </div>
      <p className="admin-page-lead admin-page-lead--tight">
        All projects for your portfolio (including drafts). Order matches the public listing when published.
      </p>

      {projects.length === 0 ? (
        <div className="admin-card">
          <p className="admin-card__help">
            No projects yet.{" "}
            <Link className="admin-link" href={`/dashboard/${slug}/projects/new`}>
              Create one
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="admin-card admin-card--list">
          <div className="admin-stack">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/${slug}/projects/${project.slug}`}
                className="admin-project-row"
              >
                <div>
                  <strong>{project.title}</strong>
                  <span className="admin-project-row__slug">{project.slug}</span>
                </div>
                <div className="admin-project-row__badges">
                  <span className="admin-project-row__meta">Order {project.display_order}</span>
                  {project.is_published === false ? (
                    <span className="admin-badge admin-badge--draft">Draft</span>
                  ) : (
                    <span className="admin-badge">Live</span>
                  )}
                  {project.is_featured ? <span className="admin-badge">Featured</span> : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
