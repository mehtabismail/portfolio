import { requireDashboard } from "@/lib/platform/dashboard-context";
import ProjectForm from "@/components/platform/ProjectForm";

export default async function DashboardNewProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requireDashboard(slug);
  return <ProjectForm dashboardSlug={slug} mode="new" initial={null} />;
}
