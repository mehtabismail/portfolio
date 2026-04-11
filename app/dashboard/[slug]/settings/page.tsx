import { requireDashboard } from "@/lib/platform/dashboard-context";
import SettingsForm from "@/components/platform/SettingsForm";

export default async function DashboardSettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { profile } = await requireDashboard(slug);
  return <SettingsForm dashboardSlug={slug} initial={profile} />;
}
