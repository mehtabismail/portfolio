import { notFound } from "next/navigation";
import AboutPageContent from "@/components/site/AboutPageContent";
import { mapPortfolioToSiteModels } from "@/lib/platform/map-portfolio-to-site";
import { getTenantDashboardPrepend } from "@/lib/platform/tenant-owner-nav";
import { getPublishedPortfolioBySlug } from "@/lib/supabase/queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) return { title: "About" };
  const { user } = mapPortfolioToSiteModels(data);
  return {
    title: `About - ${user.fullName}`,
    description: `Helping brands thrive in the digital world. From my office in ${user.location} I help companies with Digital Design, Front-End Development & Interaction.`,
  };
}

export default async function UserAboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) notFound();

  const bundle = mapPortfolioToSiteModels(data);
  const prependNav = await getTenantDashboardPrepend(slug, data.id);
  return (
    <AboutPageContent
      basePath={bundle.basePath}
      siteContent={bundle.siteContent}
      user={bundle.user}
      prependNav={prependNav}
    />
  );
}
