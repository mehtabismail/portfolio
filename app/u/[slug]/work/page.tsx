import { notFound } from "next/navigation";
import WorkPageContent from "@/components/site/WorkPageContent";
import { mapPortfolioToSiteModels } from "@/lib/platform/map-portfolio-to-site";
import { getTenantDashboardPrepend } from "@/lib/platform/tenant-owner-nav";
import { getPublishedPortfolioBySlug } from "@/lib/supabase/queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) return { title: "Work" };
  const { user } = mapPortfolioToSiteModels(data);
  return {
    title: `Work - ${user.fullName}`,
    description: user.site.description,
  };
}

export default async function UserWorkIndexPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) notFound();

  const bundle = mapPortfolioToSiteModels(data);
  const prependNav = await getTenantDashboardPrepend(slug, data.id);
  return (
    <WorkPageContent
      basePath={bundle.basePath}
      projects={bundle.projects}
      siteContent={bundle.siteContent}
      user={bundle.user}
      prependNav={prependNav}
      showArchiveNav
      archiveCount={0}
    />
  );
}
