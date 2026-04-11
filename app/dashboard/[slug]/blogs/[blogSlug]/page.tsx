import { notFound } from "next/navigation";
import BlogEditorForm from "@/components/platform/BlogEditorForm";
import ImportedBlogNotice from "@/components/platform/ImportedBlogNotice";
import { requireDashboard } from "@/lib/platform/dashboard-context";
import { getBlogRowForOwner } from "@/lib/supabase/queries/blogs";

export default async function DashboardEditBlogPage({
  params,
}: {
  params: Promise<{ slug: string; blogSlug: string }>;
}) {
  const { slug, blogSlug } = await params;
  const { supabase, profile } = await requireDashboard(slug);

  const row = await getBlogRowForOwner(profile.id, blogSlug, supabase);
  if (!row) notFound();

  if (row.source !== "platform") {
    return <ImportedBlogNotice dashboardSlug={slug} row={row} />;
  }

  return <BlogEditorForm dashboardSlug={slug} mode="edit" initial={row} />;
}
