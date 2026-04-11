import Link from "next/link";
import type { Project, SiteContent, UserData } from "@/data";
import { DefaultNavBar, WorkFilters } from "@/components";
import { tenantHref } from "@/lib/platform/tenant-href";

type Props = {
  basePath?: string;
  projects: Project[];
  siteContent: SiteContent;
  showArchiveNav?: boolean;
  archiveCount?: number;
  prependNav?: ReadonlyArray<{ href: string; label: string }>;
  user?: UserData;
};

export default async function WorkPageContent({
  basePath = "",
  projects,
  siteContent,
  showArchiveNav = true,
  archiveCount = 66,
  prependNav,
  user,
}: Props) {
  const h = (path: string) => tenantHref(basePath, path);

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
        <header className="section default-header work-header once-in" data-scroll-section>
          <DefaultNavBar
            active="work"
            basePath={basePath}
            siteContent={siteContent}
            user={user}
            prependNav={prependNav}
          />
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

        <WorkFilters projects={projects} basePath={basePath} />

        {showArchiveNav ? (
          <section className="section center-grid-btn center-grid-btn-archive once-in" data-scroll-section>
            <div className="container">
              <div className="grid-after-btn">
                <div className="btn btn-normal btn-dark">
                  <Link href={h("/archive")} className="btn-click magnetic" data-strength="25" data-strength-text="15">
                    <div className="btn-fill" />
                    <span className="btn-text">
                      <span className="btn-text-inner change">
                        {siteContent.work.archiveButtonLabel}
                        <div className="count-nr">{archiveCount}</div>
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
