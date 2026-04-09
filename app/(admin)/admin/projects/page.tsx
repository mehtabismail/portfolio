import Link from "next/link";
import { getAdminProjects } from "@/lib/admin/content-service";

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <>
      <div className="admin-list-head">
        <h1 className="admin-page-title">Projects</h1>
        <Link className="admin-link" href="/admin/projects/new">
          + New project
        </Link>
      </div>
      <p className="admin-page-lead admin-page-lead--tight">
        All projects in Firestore (including drafts). Order matches the public listing when published.
      </p>

      <div className="admin-card admin-card--list">
        <div className="admin-stack">
          {projects.map((project) => (
            <Link key={project.slug} href={`/admin/projects/${project.slug}`} className="admin-project-row">
              <div>
                <strong>{project.title}</strong>
                <span className="admin-project-row__slug">{project.slug}</span>
              </div>
              <div className="admin-project-row__badges">
                <span className="admin-project-row__meta">Order {project.order}</span>
                {project.isPublished === false ? (
                  <span className="admin-badge admin-badge--draft">Draft</span>
                ) : (
                  <span className="admin-badge">Live</span>
                )}
                {project.isFeatured ? <span className="admin-badge">Featured</span> : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
