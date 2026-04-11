import { notFound } from "next/navigation";
import ContactPageContent from "@/components/site/ContactPageContent";
import { mapPortfolioToSiteModels } from "@/lib/platform/map-portfolio-to-site";
import { getTenantDashboardPrepend } from "@/lib/platform/tenant-owner-nav";
import { getPublishedPortfolioBySlug } from "@/lib/supabase/queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) return { title: "Contact" };
  const { user } = mapPortfolioToSiteModels(data);
  return {
    title: `Contact - ${user.fullName}`,
    description: `Let's start a project together. Reach out via email or hop on a call. I work with companies from all over the world from my office in ${user.location}.`,
  };
}

export default async function UserContactPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) notFound();

  const bundle = mapPortfolioToSiteModels(data);
  const prependNav = await getTenantDashboardPrepend(slug, data.id);

  return (
    <ContactPageContent
      basePath={bundle.basePath}
      contactContent={bundle.contactContent}
      siteContent={bundle.siteContent}
      user={bundle.user}
      prependNav={prependNav}
    />
  );
}
