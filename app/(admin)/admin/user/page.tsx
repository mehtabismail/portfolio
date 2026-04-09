import JsonEditorForm from "@/components/admin/JsonEditorForm";
import { getAdminUserContent } from "@/lib/admin/content-service";

export default async function AdminUserPage() {
  const user = await getAdminUserContent();
  return (
    <JsonEditorForm
      title="Edit User Content"
      endpoint="/api/admin/content/user"
      initialValue={user}
      helpText="Update personal details, metadata, and social links used across the portfolio."
    />
  );
}
