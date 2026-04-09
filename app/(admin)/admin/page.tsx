import Link from "next/link";
import RevalidateButton from "@/components/admin/RevalidateButton";

export default function AdminHomePage() {
  return (
    <>
      <h1 className="admin-page-title">Content dashboard</h1>
      <p className="admin-page-lead">
        Edit Firestore-backed content for your portfolio. Changes apply to the live site after save (and revalidation).
      </p>

      <div className="admin-dash-grid">
        <Link className="admin-dash-tile" href="/admin/user">
          <p className="admin-dash-tile__label">User</p>
          <p className="admin-dash-tile__desc">Name, contact, social links, and SEO title/description.</p>
        </Link>
        <Link className="admin-dash-tile" href="/admin/site">
          <p className="admin-dash-tile__label">Site copy</p>
          <p className="admin-dash-tile__desc">Navigation, home, work, archive, footer, and shared labels.</p>
        </Link>
        <Link className="admin-dash-tile" href="/admin/contact">
          <p className="admin-dash-tile__label">Contact</p>
          <p className="admin-dash-tile__desc">Hero lines, form labels, placeholders, and section headings.</p>
        </Link>
        <Link className="admin-dash-tile" href="/admin/projects">
          <p className="admin-dash-tile__label">Projects</p>
          <p className="admin-dash-tile__desc">CRUD, publish state, featured flag, ordering, and media URLs.</p>
        </Link>
      </div>

      <section className="admin-card">
        <h2 className="admin-card__title">Cache</h2>
        <p className="admin-card__help">
          Saves already trigger revalidation. Use this if the public site still looks stale.
        </p>
        <RevalidateButton />
      </section>
    </>
  );
}
