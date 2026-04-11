import BlogEditorForm from "@/components/platform/BlogEditorForm";
import { requireDashboard } from "@/lib/platform/dashboard-context";

export default async function DashboardNewBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requireDashboard(slug);
  return <BlogEditorForm dashboardSlug={slug} mode="new" initial={null} />;
}
