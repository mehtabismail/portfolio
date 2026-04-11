import { notFound } from "next/navigation";
import HomePageContent from "@/components/site/HomePageContent";
import { mapPortfolioToSiteModels } from "@/lib/platform/map-portfolio-to-site";
import { getTenantDashboardPrepend } from "@/lib/platform/tenant-owner-nav";
import { getPublishedPortfolioBySlug, listPublishedPortfolioSlugs } from "@/lib/supabase/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await listPublishedPortfolioSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export default async function UserPortfolioHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) notFound();

  const bundle = mapPortfolioToSiteModels(data);
  const prependNav = await getTenantDashboardPrepend(slug, data.id);
  return (
    <HomePageContent
      basePath={bundle.basePath}
      featuredProjects={bundle.featuredProjects}
      siteContent={bundle.siteContent}
      user={bundle.user}
      moreWorkCount={bundle.totalPublicProjects}
      showCreatePortfolioCta={false}
      prependNav={prependNav}
    />
  );
}
