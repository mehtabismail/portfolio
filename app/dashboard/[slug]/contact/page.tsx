import JsonEditorForm from "@/components/admin/JsonEditorForm";
import { defaultTenantCmsContact } from "@/lib/platform/tenant-cms-initial";
import { requireDashboard } from "@/lib/platform/dashboard-context";

export default async function DashboardContactContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { profile } = await requireDashboard(slug);
  const initial = profile.cms_contact != null ? profile.cms_contact : defaultTenantCmsContact();

  return (
    <JsonEditorForm
      title="Edit Contact Content"
      endpoint="/api/platform/cms/contact"
      initialValue={initial}
      helpText="Hero lines, form labels, placeholders, and section headings for your contact page."
    />
  );
}
