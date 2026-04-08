import Link from "next/link";
import { DefaultNavBar, WorkFilters } from "@/components";
import { getProjectsContent, getSiteContentData, getUserContent } from "@/lib/content";

export async function generateMetadata() {
  const user = await getUserContent();
  return {
    title: `Work - ${user.fullName}`,
    description:
      "Creating next level digital products. I help companies from all over the world (Netherlands, United States, United Kingdom, Australia, Germany etc.)",
  };
}

export default async function WorkPage() {
  const [projects, siteContent] = await Promise.all([
    getProjectsContent(),
    getSiteContentData(),
  ]);

  return (
    <>
      <div className="mouse-pos-list-image no-select">
        <div className="mouse-pos-list-image-bounce overlay">
          <div className="float-image-wrap">
            {projects.map((p) => (
              <li
                key={p.slug}
                className={`mouse-pos-list-image-inner ${p.categories.join(" ")} visible`}
              >
                <div
                  className="overlay overlay-image lazy"
                  style={{
                    backgroundColor: p.thumbnailBg,
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                  data-bg={p.thumbnailHoverUrl || p.thumbnailUrl}
                />
              </li>
            ))}
          </div>
        </div>
      </div>
      <div className="mouse-pos-list-btn no-select" />
      <div className="mouse-pos-list-span no-select">
        <p>View</p>
      </div>

      <div className="main-wrap" data-scroll-container>
        <header
          className="section default-header work-header once-in"
          data-scroll-section
        >
          <DefaultNavBar active="work" />
          <div className="container medium">
            <div className="row">
              <div className="flex-col once-in">
                <h1>
                  <span>{siteContent.work.headerLine1} </span>
                  <span>{siteContent.work.headerLine2}</span>
                </h1>
              </div>
            </div>
          </div>
        </header>

        <WorkFilters projects={projects} />

        <section
          className="section center-grid-btn center-grid-btn-archive once-in"
          data-scroll-section
        >
          <div className="container">
            <div className="grid-after-btn">
              <div className="btn btn-normal btn-dark">
                <Link
                  href="/archive"
                  className="btn-click magnetic"
                  data-strength="25"
                  data-strength-text="15"
                >
                  <div className="btn-fill" />
                  <span className="btn-text">
                    <span className="btn-text-inner change">
                      {siteContent.work.archiveButtonLabel}
                      <div className="count-nr">66</div>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
