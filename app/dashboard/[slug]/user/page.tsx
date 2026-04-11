import JsonEditorForm from "@/components/admin/JsonEditorForm";
import { defaultTenantCmsUser } from "@/lib/platform/tenant-cms-initial";
import { requireDashboard } from "@/lib/platform/dashboard-context";

export default async function DashboardUserContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { profile } = await requireDashboard(slug);
  const initial = profile.cms_user != null ? profile.cms_user : defaultTenantCmsUser(profile);

  return (
    <JsonEditorForm
      title="Edit User Content"
      endpoint="/api/platform/cms/user"
      initialValue={initial}
      helpText="Update personal details, metadata, and social links used across your public portfolio."
    />
  );
}
