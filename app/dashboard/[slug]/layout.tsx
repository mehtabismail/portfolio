import "@/app/(admin)/admin/admin-panel.css";
import TenantAdminChrome from "@/components/platform/TenantAdminChrome";
import { requireDashboard } from "@/lib/platform/dashboard-context";

export default async function DashboardSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { profile } = await requireDashboard(slug);

  return (
    <TenantAdminChrome slug={slug} displayName={profile.display_name}>
      {children}
    </TenantAdminChrome>
  );
}
