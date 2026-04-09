import JsonEditorForm from "@/components/admin/JsonEditorForm";
import { getAdminSiteContent } from "@/lib/admin/content-service";

export default async function AdminSitePage() {
  const site = await getAdminSiteContent();
  return (
    <JsonEditorForm
      title="Edit Site Content"
      endpoint="/api/admin/content/site"
      initialValue={site}
      helpText="Manage nav links and all global text blocks for home, work, archive, footer, and common labels."
    />
  );
}
