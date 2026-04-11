import { notFound } from "next/navigation";
import ProjectCasePageContent from "@/components/site/ProjectCasePageContent";
import {
  mapPortfolioToSiteModels,
  mapProjectDataToProject,
} from "@/lib/platform/map-portfolio-to-site";
import { getTenantDashboardPrepend } from "@/lib/platform/tenant-owner-nav";
import {
  getPublishedPortfolioBySlug,
  getPublishedProjectDataBySlugs,
  listPublishedPortfolioSlugs,
} from "@/lib/supabase/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await listPublishedPortfolioSlugs();
    const out: { slug: string; projectSlug: string }[] = [];
    for (const slug of slugs) {
      const portfolio = await getPublishedPortfolioBySlug(slug);
      if (!portfolio) continue;
      for (const p of portfolio.projects) {
        out.push({ slug, projectSlug: p.slug });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string }>;
}) {
  const { slug, projectSlug } = await params;
  const project = await getPublishedProjectDataBySlugs(slug, projectSlug);
  const portfolio = await getPublishedPortfolioBySlug(slug);
  if (!project || !portfolio) return { title: "Project" };
  const titleDisplay = project.title_display?.trim() || project.title;
  const { user } = mapPortfolioToSiteModels(portfolio);
  return {
    title: `${titleDisplay} - ${user.fullName}`,
    description: project.description ?? user.site.description,
  };
}

export default async function UserProjectPage({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string }>;
}) {
  const { slug, projectSlug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) notFound();

  const activeProject = await getPublishedProjectDataBySlugs(slug, projectSlug);
  if (!activeProject) notFound();

  const bundle = mapPortfolioToSiteModels(data);
  const project = mapProjectDataToProject(activeProject, data.location);
  const allProjects = data.projects.map((p) => mapProjectDataToProject(p, data.location));
  const prependNav = await getTenantDashboardPrepend(slug, data.id);

  return (
    <ProjectCasePageContent
      basePath={bundle.basePath}
      project={project}
      allProjects={allProjects}
      activeSlug={projectSlug}
      siteContent={bundle.siteContent}
      user={bundle.user}
      prependNav={prependNav}
    />
  );
}
