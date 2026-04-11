import Link from "next/link";
import type { BlogRow } from "@/lib/supabase/types";

type Props = {
  dashboardSlug: string;
  row: BlogRow;
};

export default function ImportedBlogNotice({ dashboardSlug, row }: Props) {
  const base = `/dashboard/${dashboardSlug}`;
  return (
    <section className="admin-card admin-card--wide">
      <h1 className="admin-card__title">{row.title}</h1>
      <p className="admin-card__help">
        This post was imported from <strong>{row.source}</strong> and cannot be edited here. Re-sync or change the
        connection under{" "}
        <Link href={`${base}/integrations`} className="admin-link">
          Integrations
        </Link>
        .
      </p>
      {row.external_url ? (
        <p className="admin-card__help">
          <a href={row.external_url} className="admin-link" target="_blank" rel="noopener noreferrer">
            Open original
          </a>
        </p>
      ) : null}
      <div className="admin-actions">
        <Link href={`${base}/blogs`} className="admin-btn admin-btn--ghost">
          Back to posts
        </Link>
      </div>
    </section>
  );
}
