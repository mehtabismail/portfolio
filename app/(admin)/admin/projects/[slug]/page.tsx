import { notFound } from "next/navigation";
import ProjectEditorForm from "@/components/admin/ProjectEditorForm";
import { getAdminProjectBySlug } from "@/lib/admin/content-service";

export default async function AdminProjectSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getAdminProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectEditorForm initialProject={project} />;
}
