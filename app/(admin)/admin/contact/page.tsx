import JsonEditorForm from "@/components/admin/JsonEditorForm";
import { getAdminContactContent } from "@/lib/admin/content-service";

export default async function AdminContactPage() {
  const contact = await getAdminContactContent();
  return (
    <JsonEditorForm
      title="Edit Contact Content"
      endpoint="/api/admin/content/contact"
      initialValue={contact}
      helpText="Update contact hero copy, form labels/placeholders, and section headings."
    />
  );
}
