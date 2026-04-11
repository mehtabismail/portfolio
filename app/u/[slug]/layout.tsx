import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Animations, FixedNav, HamburgerNav, LoadingWrapper, NavProvider } from "@/components";
import { siteContent as defaultSiteContent } from "@/data/site";
import { mapPortfolioToSiteModels } from "@/lib/platform/map-portfolio-to-site";
import { tenantHref } from "@/lib/platform/tenant-href";
import { getTenantDashboardPrepend } from "@/lib/platform/tenant-owner-nav";
import { getPublishedPortfolioBySlug } from "@/lib/supabase/queries";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) return { title: "Portfolio" };
  const { user } = mapPortfolioToSiteModels(data);
  return {
    title: user.site.title,
    description: user.site.description,
    openGraph: {
      title: user.site.title,
      description: user.site.description,
      siteName: user.fullName,
      locale: "en",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: user.site.title,
      description: user.site.description,
    },
  };
}

export default async function TenantPortfolioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) notFound();

  const bundle = mapPortfolioToSiteModels(data);
  const { user, siteContent } = bundle;
  const basePath = `/u/${slug}`;
  const dashboardPrepend = await getTenantDashboardPrepend(slug, data.id);
  const mainNav = defaultSiteContent.nav.main.map((item) => ({
    label: item.label,
    href: tenantHref(basePath, item.href),
  }));
  const navLinks = [...(dashboardPrepend ?? []), ...mainNav];

  return (
    <div data-barba="wrapper">
      <NavProvider>
        <div className="no-scroll-overlay"></div>
        <LoadingWrapper />
        <main className="main" id="home" data-barba="container" data-barba-namespace="home">
          <HamburgerNav />
          <div className="overlay fixed-nav-back"></div>
          <FixedNav
            navLinks={navLinks}
            socials={user.socials}
            socialsTitle={siteContent.common.socialsTitle}
          />
          {children}
        </main>
        <Animations />
      </NavProvider>
    </div>
  );
}
