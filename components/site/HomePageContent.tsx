import Link from "next/link";
import type { Project, SiteContent, UserData } from "@/data";
import { NavCreditStrip } from "@/components";
import { getFeaturedProjectsContent, getSiteContentData, getUserContent } from "@/lib/content";
import { tenantHref } from "@/lib/platform/tenant-href";

export type HomePageContentProps = {
  basePath?: string;
  featuredProjects?: Project[];
  siteContent?: SiteContent;
  user?: UserData;
  moreWorkCount?: number;
  showCreatePortfolioCta?: boolean;
  /** First links in the top bar when the signed-in viewer owns this portfolio (e.g. Dashboard). */
  prependNav?: ReadonlyArray<{ href: string; label: string }>;
};

export default async function HomePageContent(props: HomePageContentProps = {}) {
  const {
    basePath = "",
    featuredProjects: featuredProjectsProp,
    siteContent: siteContentProp,
    user: userProp,
    moreWorkCount: moreWorkCountProp,
    showCreatePortfolioCta = true,
    prependNav,
  } = props;

  const h = (path: string) => tenantHref(basePath, path);
  const [featuredProjectsFetched, siteContentFetched, userFetched] = await Promise.all([
    getFeaturedProjectsContent(),
    getSiteContentData(),
    getUserContent(),
  ]);
  const featuredProjects = featuredProjectsProp ?? featuredProjectsFetched;
  const siteContent = siteContentProp ?? siteContentFetched;
  const user = userProp ?? userFetched;
  const moreWorkCount = moreWorkCountProp ?? 11;

  return (
    <>
      {/* Floating hover images that follow cursor */}
      <div className="mouse-pos-list-image no-select">
        <div className="mouse-pos-list-image-bounce overlay">
          <div className="float-image-wrap">
            {featuredProjects.map((project, index) => (
              <li
                key={project.slug}
                className={`mouse-pos-list-image-inner ${project.categories.join(" ")} visible`}
              >
                <div
                  className="overlay overlay-image lazy"
                  style={{
                    backgroundColor: project.thumbnailBg || "#F1F1F1",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                  data-bg={project.thumbnailUrl}
                ></div>
              </li>
            ))}
          </div>
        </div>
      </div>
      <div className="mouse-pos-list-btn no-select"></div>
      <div className="mouse-pos-list-span no-select">
        <p>View</p>
      </div>

      {/* Main Content */}
      <div className="main-wrap" data-scroll-container>
        {/* Header Section */}
        <header className="section home-header theme-dark" data-scroll-section>
          <div
            className="overlay personal-image no-select once-in"
            data-scroll
            data-scroll-speed="-3"
            data-scroll-position="top"
          >
            <img src={user.avatarUrl} alt={user.firstName} />
          </div>
          <div className="overlay get-height once-in once-in-secondary">
            <div className="hanger">
              <p>
                <span>Located </span>
                <span>{"in " + user.location}</span>
              </p>
              <svg
                width="300px"
                height="121px"
                viewBox="0 0 300 121"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Combined Shape</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g transform="translate(0.000000, -366.000000)" fill="#1C1D20">
                    <g transform="translate(149.816828, 426.633657) rotate(90.000000) translate(-149.816828, -426.633657) translate(89.816828, 276.816828)">
                      <g transform="translate(60.000000, 149.816828) rotate(-90.000000) translate(-60.000000, -149.816828) translate(-89.816828, 89.816828)">
                        <path d="M239.633657,0 C272.770742,1.0182436e-15 299.633657,26.862915 299.633657,60 C299.633657,93.137085 272.770742,120 239.633657,120 L0,120 L0,0 L239.633657,0 Z M239.633657,18.7755102 C216.866,18.7755102 198.409167,37.232343 198.409167,60 C198.409167,82.767657 216.866,101.22449 239.633657,101.22449 C262.401314,101.22449 280.858147,82.767657 280.858147,60 C280.858147,37.232343 262.401314,18.7755102 239.633657,18.7755102 Z"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <div className="digital-ball">
                <div className="overlay"></div>
                <div className="globe">
                  <div className="globe-wrap">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle-hor"></div>
                    <div className="circle-hor-middle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="nav-bar">
            <div className="credits-top">
              <div className="btn btn-link btn-left-top">
                <Link href={h("/")} className="btn-click magnetic" data-strength="20" data-strength-text="10">
                  <span className="btn-text">
                    <NavCreditStrip firstName={user.firstName} fullName={user.fullName} />
                  </span>
                </Link>
              </div>
            </div>
            <ul className="links-wrap">
              {(prependNav ?? []).map(({ href, label }) => (
                <li key={href} className="btn btn-link">
                  <Link href={href} className="btn-click magnetic" data-strength="20" data-strength-text="10">
                    <span className="btn-text">
                      <span className="btn-text-inner">{label}</span>
                    </span>
                  </Link>
                </li>
              ))}
              <li className="btn btn-link">
                <Link href={h("/work")} className="btn-click magnetic" data-strength="20" data-strength-text="10">
                  <span className="btn-text">
                    <span className="btn-text-inner">Work</span>
                  </span>
                </Link>
              </li>
              <li className="btn btn-link">
                <Link href={h("/about")} className="btn-click magnetic" data-strength="20" data-strength-text="10">
                  <span className="btn-text">
                    <span className="btn-text-inner">About</span>
                  </span>
                </Link>
              </li>
              <li className="btn btn-link">
                <Link href={h("/contact")} className="btn-click magnetic" data-strength="20" data-strength-text="10">
                  <span className="btn-text">
                    <span className="btn-text-inner">Contact</span>
                  </span>
                </Link>
              </li>
              <li className="btn btn-link btn-menu">
                <div className="btn-click magnetic" data-strength="20" data-strength-text="10">
                  <div className="btn-text">
                    <span className="btn-text-inner">Menu</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="container once-in once-in-secondary">
            <div className="row">
              <div className="flex-col">
                <div className="header-above-h4" data-scroll data-scroll-speed="1">
                  <div className="arrow big">
                    <svg width="14px" height="14px" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g transform="translate(-1019.000000, -279.000000)" stroke="#FFFFFF" strokeWidth="1.5">
                          <g transform="translate(1026.000000, 286.000000) rotate(90.000000) translate(-1026.000000, -286.000000) translate(1020.000000, 280.000000)">
                            <polyline points="2.76923077 0 12 0 12 9.23076923"></polyline>
                            <line x1="12" y1="0" x2="0" y2="12"></line>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>
                <h4>
                  <span>{siteContent.home.heroRolePrefix}</span> {siteContent.home.heroRoleSuffix}
                </h4>
              </div>
            </div>
          </div>

          {/* Big Scrolling Name */}
          <div className="big-name">
            <div
              className="name-h1"
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="4"
              data-scroll-position="top"
            >
              <div className="name-wrap">
                <h1 className="no-select once-in once-in-secondary">
                  {user.fullName}<span className="spacer">—</span>
                </h1>
              </div>
            </div>
          </div>
          <div className="white-block"></div>
        </header>

        {/* Intro Section */}
        <section className="section home-intro" data-scroll-section>
          <div className="container medium">
            <div className="row">
              <div className="flex-col">
                <h4 className="span-lines animate">
                  {siteContent.home.introTitle}
                </h4>
              </div>
              <div className="flex-col">
                <div className="text-wrap fade-in animate">
                  <p>
                    {siteContent.home.introDescription}
                  </p>
                </div>
                <div className="btn btn-round" data-scroll data-scroll-speed="2">
                  <Link href={h("/about")} className="btn-click magnetic" data-strength="100" data-strength-text="50">
                    <div className="btn-fill"></div>
                    <span className="btn-text">
                      <span className="btn-text-inner">About me</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Grid Section */}
        <section className="section work-grid large-work-grid" data-scroll-section>
          <div className="container">
            <div className="grid-sub-title">
              <div className="flex-col">
                <h5>{siteContent.home.recentWorkTitle}</h5>
              </div>
            </div>
            <ul className="work-items mouse-pos-list-image-wrap">
              {featuredProjects.map((project, index) => (
                <li key={project.slug} className={`${project.categories.join(" ")} visible`}>
                  <div className="stripe animate"></div>
                  <Link href={h(`/work/${project.slug}`)} className="row">
                    <div className="flex-col">
                      <h4>
                        <span>{project.title}</span>
                      </h4>
                    </div>
                    <div className="flex-col animate">
                      <p>{project.services}</p>
                    </div>
                  </Link>
                </li>
              ))}
              <div className="stripe last animate"></div>
            </ul>
          </div>
        </section>

        {/* Work Tiles Section */}
        <section className="section work-tiles work-tiles-home" data-scroll-section>
          <div className="container">
            <ul>
              {featuredProjects.map((project, index) => (
                <li key={project.slug} className={`${project.categories.join(" ")} visible`}>
                  <div className="single-tile-wrap">
                    <Link href={h(`/work/${project.slug}`)} className="row">
                      <div className="flex-col">
                        <div className="tile-image">
                          <div
                            className="overlay overlay-image lazy"
                            style={{
                              backgroundColor: project.thumbnailBg || "#F1F1F1",
                              backgroundPosition: "center center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                            }}
                            data-bg={project.thumbnailUrl}
                          ></div>
                        </div>
                      </div>
                      <div className="flex-col">
                        <h4>
                          <span>{project.title}</span>
                        </h4>
                        <div className="stripe"></div>
                      </div>
                      <div className="flex-col">
                        <p>{project.services}</p>
                      </div>
                      <div className="flex-col">
                        <p>{project.year}</p>
                      </div>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* More Work Button */}
        <section className="section center-grid-btn center-grid-btn-home" data-scroll-section>
          <div className="container">
            <div className="grid-after-btn">
              <div className="btn btn-normal">
                <Link href={h("/work")} className="btn-click magnetic" data-strength="25" data-strength-text="15">
                  <div className="btn-fill"></div>
                  <span className="btn-text">
                    <span className="btn-text-inner change">
                      {siteContent.home.moreWorkLabel}
                      <div className="count-nr">{moreWorkCount}</div>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal Items Section */}
        <section className="section horizontal-items" data-scroll-section>
          <div className="container">
            <div className="row row-1" data-scroll data-scroll-speed="-1" data-scroll-direction="horizontal">
              <div className="flex-col">
                <div className="horizontal-single-item">
                  <div
                    className="overlay lazy"
                    style={{
                      backgroundPosition: "center center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                    data-bg="/assets/img/home-item-1.jpg"
                  ></div>
                </div>
              </div>
              <div className="flex-col">
                <div className="horizontal-single-item">
                  <div className="overlay playpauze">
                    <video className="overlay lazy" src="/assets/img/home-item-2.mp4" loop muted playsInline></video>
                  </div>
                </div>
              </div>
              <div className="flex-col">
                <div className="horizontal-single-item">
                  <div
                    className="overlay lazy"
                    style={{
                      backgroundPosition: "center center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                    data-bg="/assets/img/home-item-3.jpg"
                  ></div>
                </div>
              </div>
              <div className="flex-col">
                <div className="horizontal-single-item">
                  <div className="overlay playpauze">
                    <video className="overlay lazy" src="/assets/img/home-item-4.mp4" loop muted playsInline></video>
                  </div>
                </div>
              </div>
            </div>
            <div className="row row-2" data-scroll data-scroll-speed="1" data-scroll-direction="horizontal">
              <div className="flex-col">
                <div className="horizontal-single-item">
                  <div className="overlay playpauze">
                    <video className="overlay lazy" src="/assets/img/home-item-5.mp4" loop muted playsInline></video>
                  </div>
                </div>
              </div>
              <div className="flex-col">
                <div className="horizontal-single-item">
                  <div
                    className="overlay lazy"
                    style={{
                      backgroundPosition: "center center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                    data-bg="/assets/img/home-item-6.jpg"
                  ></div>
                </div>
              </div>
              <div className="flex-col">
                <div className="horizontal-single-item">
                  <div className="overlay playpauze">
                    <video className="overlay lazy" src="/assets/img/home-item-7.mp4" loop muted playsInline></video>
                  </div>
                </div>
              </div>
              <div className="flex-col">
                <div className="horizontal-single-item">
                  <div
                    className="overlay lazy"
                    style={{
                      backgroundPosition: "center center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                    data-bg="/assets/img/home-item-8.jpg"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Rounded Div */}
        <div className="footer-rounded-div" data-scroll-section>
          <div className="rounded-div-wrap">
            <div className="rounded-div"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-wrap footer-footer-wrap theme-dark" data-scroll-section>
          <footer className="section footer" data-scroll data-scroll-speed="-4" data-scroll-position="bottom">
            <div className="container medium">
              <div className="row">
                <div className="flex-col">
                  <div className="arrow">
                    <svg width="14px" height="14px" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g transform="translate(-1019.000000, -279.000000)" stroke="#FFFFFF" strokeWidth="1.5">
                          <g transform="translate(1026.000000, 286.000000) rotate(90.000000) translate(-1026.000000, -286.000000) translate(1020.000000, 280.000000)">
                            <polyline points="2.76923077 0 12 0 12 9.23076923"></polyline>
                            <line x1="12" y1="0" x2="0" y2="12"></line>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <h2>
                    <span>
                      <div className="profile-picture"></div> Let&apos;s work{" "}
                    </span>
                    <span>together</span>
                  </h2>
                </div>
              </div>
              <div className="row">
                <div className="flex-col">
                  <div className="stripe"></div>
                  <div className="btn-fixed">
                    <div
                      className="btn btn-round"
                      data-scroll
                      data-scroll-speed="-1"
                      data-scroll-direction="horizontal"
                      data-scroll-position="bottom"
                      data-scroll-offset="-50%, 0"
                    >
                      <Link
                        href={h("/contact")}
                        className="btn-click magnetic"
                        data-strength="100"
                        data-strength-text="50"
                      >
                        <div className="btn-fill"></div>
                        <span className="btn-text">
                          <span className="btn-text-inner">Get in touch</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="flex-col">
                  <div className="btn btn-normal">
                    <a
                      href={`mailto:${user.email}`}
                      className="btn-click magnetic"
                      data-strength="25"
                      data-strength-text="15"
                    >
                      <div className="btn-fill"></div>
                      <span className="btn-text">
                        <span className="btn-text-inner change">{user.email}</span>
                      </span>
                    </a>
                  </div>
                  <div className="btn btn-normal">
                    <a
                      href={`tel:${user.phoneRaw}`}
                      className="btn-click magnetic"
                      data-strength="25"
                      data-strength-text="15"
                    >
                      <div className="btn-fill"></div>
                      <span className="btn-text">
                        <span className="btn-text-inner change">{user.phoneDisplay}</span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="container no-padding">
              <div className="row bottom-footer">
                <div className="flex-col">
                  {showCreatePortfolioCta ? (
                    <div className="btn btn-link" style={{ marginBottom: "1rem" }}>
                      <Link
                        href="/create"
                        className="btn-click magnetic"
                        data-strength="20"
                        data-strength-text="10"
                      >
                        <span className="btn-text">
                          <span className="btn-text-inner">Create your portfolio</span>
                        </span>
                      </Link>
                    </div>
                  ) : null}
                  <div className="credits">
                    <h5>{siteContent.common.versionLabel}</h5>
                    <p>{siteContent.common.versionValue}</p>
                  </div>
                  <div className="time">
                    <h5>{siteContent.common.localTimeLabel}</h5>
                    <p>
                      <span id="timeSpan">09:41 PM CET</span>
                    </p>
                  </div>
                </div>
                <div className="flex-col">
                  <div className="socials">
                    <h5>{siteContent.common.socialsTitle}</h5>
                    <ul>
                      {user.socials.map(({ href, label }) => (
                        <li key={href} className="btn btn-link btn-link-external">
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-click magnetic"
                            data-strength="20"
                            data-strength-text="10"
                          >
                            <span className="btn-text">
                              <span className="btn-text-inner">{label}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="stripe"></div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
          <div className="overlay overlay-gradient"></div>
        </div>
      </div>
    </>
  );
}
