import ProjectEditorForm from "@/components/admin/ProjectEditorForm";
import { getDefaultProjects } from "@/lib/admin/defaults";

export default function AdminProjectNewPage() {
  const template = getDefaultProjects()[0];
  const nextOrder = getDefaultProjects().length + 1;

  return (
    <ProjectEditorForm
      isNew
      initialProject={{
        ...template,
        slug: "",
        title: "",
        titleDisplay: "",
        location: "",
        year: "",
        services: "",
        thumbnailUrl: "",
        thumbnailHoverUrl: "",
        heroImageUrl: "",
        videoUrl: "",
        role: "",
        credits: "",
        liveUrl: "",
        gallery: [],
        thumbnailBg: "#F1F1F1",
        order: nextOrder,
        isPublished: true,
        isFeatured: false,
      }}
    />
  );
}
