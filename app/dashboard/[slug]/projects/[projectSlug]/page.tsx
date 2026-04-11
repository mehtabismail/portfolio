import { notFound } from "next/navigation";
import { requireDashboard } from "@/lib/platform/dashboard-context";
import type { ProjectRow } from "@/lib/supabase/types";
import ProjectForm from "@/components/platform/ProjectForm";

const PROJECT_FULL =
  "id, user_id, slug, title, title_display, description, services, tech_stack, categories, thumbnail_url, thumbnail_bg, hero_image_url, gallery, live_url, year, role, credits, is_published, is_featured, display_order, created_at, updated_at" as const;

export default async function DashboardEditProjectPage({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string }>;
}) {
  const { slug, projectSlug } = await params;
  const { supabase, profile } = await requireDashboard(slug);

  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_FULL)
    .eq("user_id", profile.id)
    .eq("slug", projectSlug)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  return <ProjectForm dashboardSlug={slug} mode="edit" initial={data as ProjectRow} />;
}
