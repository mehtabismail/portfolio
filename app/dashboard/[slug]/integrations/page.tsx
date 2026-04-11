import IntegrationsPanel from "@/components/platform/IntegrationsPanel";
import { requireDashboard } from "@/lib/platform/dashboard-context";
import { listIntegrationsForCurrentUser } from "@/lib/supabase/queries/integrations";

export default async function DashboardIntegrationsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase } = await requireDashboard(slug);

  let initial = await listIntegrationsForCurrentUser(supabase);
  initial = initial.filter((i) => i.provider === "medium" || i.provider === "devto");

  return <IntegrationsPanel dashboardSlug={slug} initial={initial} />;
}
