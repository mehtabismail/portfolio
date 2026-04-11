import JsonEditorForm from "@/components/admin/JsonEditorForm";
import { defaultTenantCmsSite } from "@/lib/platform/tenant-cms-initial";
import { requireDashboard } from "@/lib/platform/dashboard-context";

export default async function DashboardSiteContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { profile } = await requireDashboard(slug);
  const initial = profile.cms_site != null ? profile.cms_site : defaultTenantCmsSite();

  return (
    <JsonEditorForm
      title="Edit Site Content"
      endpoint="/api/platform/cms/site"
      initialValue={initial}
      helpText="Navigation labels, home hero copy, work page headers, footer strings, and archive text."
    />
  );
}
