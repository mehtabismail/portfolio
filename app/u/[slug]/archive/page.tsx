import { notFound } from "next/navigation";
import { ArrowIcon, DefaultNavBar } from "@/components";
import { mapPortfolioToSiteModels } from "@/lib/platform/map-portfolio-to-site";
import { getTenantDashboardPrepend } from "@/lib/platform/tenant-owner-nav";
import { getPublishedPortfolioBySlug } from "@/lib/supabase/queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) return { title: "Archive" };
  const { user } = mapPortfolioToSiteModels(data);
  return {
    title: `Archive - ${user.fullName}`,
    description: `Archive of recent and past work. © ${user.fullName}`,
  };
}

export default async function UserArchivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) notFound();

  const bundle = mapPortfolioToSiteModels(data);
  const { siteContent } = bundle;
  const prependNav = await getTenantDashboardPrepend(slug, data.id);

  return (
    <>
      <div className="mouse-pos-list-image no-select" />
      <div className="mouse-pos-list-btn no-select" />
      <div className="mouse-pos-list-span no-select">
        <p>
          {siteContent.archive.hoverLabel} <ArrowIcon className="arrow" />
        </p>
      </div>

      <div className="main-wrap" data-scroll-container>
        <header className="section default-header archive-header once-in" data-scroll-section>
          <DefaultNavBar
            active="archive"
            basePath={bundle.basePath}
            siteContent={siteContent}
            user={bundle.user}
            prependNav={prependNav}
          />
          <div className="container medium">
            <div className="row">
              <div className="flex-col once-in">
                <h1>
                  <span>{siteContent.archive.headerLine1} </span>
                  <span>{siteContent.archive.headerLine2}</span>
                </h1>
              </div>
            </div>
          </div>
        </header>

        <section className="section archive-content once-in" data-scroll-section>
          <div className="container">
            <p>{siteContent.archive.placeholder}</p>
          </div>
        </section>
      </div>
    </>
  );
}
