import Link from "next/link";
import PlatformRevalidateButton from "@/components/platform/PlatformRevalidateButton";
import { requireDashboard } from "@/lib/platform/dashboard-context";

export default async function DashboardHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { profile } = await requireDashboard(slug);

  return (
    <>
      <h1 className="admin-page-title">Content dashboard</h1>
      <p className="admin-page-lead">
        Edit Supabase-backed content for your portfolio at <strong>/u/{slug}</strong>. Changes apply to the live site
        after save (and revalidation).
      </p>

      <div className="admin-dash-grid">
        <Link className="admin-dash-tile" href={`/dashboard/${slug}/user`}>
          <p className="admin-dash-tile__label">User</p>
          <p className="admin-dash-tile__desc">Name, contact, social links, and SEO title/description.</p>
        </Link>
        <Link className="admin-dash-tile" href={`/dashboard/${slug}/site`}>
          <p className="admin-dash-tile__label">Site copy</p>
          <p className="admin-dash-tile__desc">Navigation, home, work, archive, footer, and shared labels.</p>
        </Link>
        <Link className="admin-dash-tile" href={`/dashboard/${slug}/contact`}>
          <p className="admin-dash-tile__label">Contact</p>
          <p className="admin-dash-tile__desc">Hero lines, form labels, placeholders, and section headings.</p>
        </Link>
        <Link className="admin-dash-tile" href={`/dashboard/${slug}/projects`}>
          <p className="admin-dash-tile__label">Projects</p>
          <p className="admin-dash-tile__desc">CRUD, publish state, featured flag, ordering, and media URLs.</p>
        </Link>
        <Link className="admin-dash-tile" href={`/dashboard/${slug}/blogs`}>
          <p className="admin-dash-tile__label">Blog</p>
          <p className="admin-dash-tile__desc">Markdown posts, tags, cover image, draft or published.</p>
        </Link>
        <Link className="admin-dash-tile" href={`/dashboard/${slug}/integrations`}>
          <p className="admin-dash-tile__label">Integrations</p>
          <p className="admin-dash-tile__desc">Sync posts from Medium and Dev.to into your blog.</p>
        </Link>
        <Link className="admin-dash-tile" href={`/dashboard/${slug}/settings`}>
          <p className="admin-dash-tile__label">Settings</p>
          <p className="admin-dash-tile__desc">URL slug, profile fields, publish toggle, and account details.</p>
        </Link>
      </div>

      <section className="admin-card">
        <h2 className="admin-card__title">Publish status</h2>
        <p className="admin-card__help">
          Your portfolio is <strong>{profile.is_published ? "published" : "draft"}</strong>. Visitors only see published
          projects when the portfolio is published (adjust in Settings).
        </p>
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">Cache</h2>
        <p className="admin-card__help">
          Saves already trigger revalidation. Use this if the public site still looks stale.
        </p>
        <PlatformRevalidateButton slug={slug} />
      </section>
    </>
  );
}
