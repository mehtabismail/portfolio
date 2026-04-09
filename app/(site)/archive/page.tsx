import { ArrowIcon, DefaultNavBar } from "@/components";
import { getSiteContentData, getUserContent } from "@/lib/content";

export async function generateMetadata() {
  const user = await getUserContent();
  return {
    title: `Archive - ${user.fullName}`,
    description: `Archive of recent and past work made by ${user.fullName}. © Code by ${user.firstName}`,
  };
}

export default async function ArchivePage() {
  const siteContent = await getSiteContentData();
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
        <header
          className="section default-header archive-header once-in"
          data-scroll-section
        >
          <DefaultNavBar active="archive" />
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
            <p>
              {siteContent.archive.placeholder}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
