import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/data";
import { ArrowIcon, DefaultNavBar } from "@/components";
import {
  getProjectBySlugContent,
  getProjectsContent,
  getUserContent,
} from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [project, user] = await Promise.all([
    getProjectBySlugContent(slug),
    getUserContent(),
  ]);
  if (!project)
    return { title: `Project - ${user.fullName}` };
  return {
    title: `${project.titleDisplay} - ${user.fullName}`,
    description:
      `Helping brands thrive in the digital world. Located in ${user.location}.`,
  };
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlugContent(slug),
    getProjectsContent(),
  ]);
  if (!project) notFound();

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <div className="main-wrap" data-scroll-container>
      <section className="section case-top-wrap">
        <header
          className="section default-header case-header once-in"
          data-scroll-section
        >
          <DefaultNavBar active="work" />
          <div className="container medium once-in">
            <div className="row">
              <div className="flex-col">
                <h1>{project.titleDisplay}</h1>
              </div>
            </div>
          </div>
        </header>

        <section
          className="section case-intro once-in"
          data-scroll-section
        >
          <div className="container medium">
            <div className="row">
              <div className="flex-col">
                <h5>Role / Services</h5>
                <div className="stripe" />
                <li>
                  <p>{project.services}</p>
                </li>
              </div>
              {project.credits && (
                <div className="flex-col">
                  <h5>Credits</h5>
                  <div className="stripe" />
                  <li>
                    <p>{project.credits}</p>
                  </li>
                </div>
              )}
              <div className="flex-col">
                <h5>Location & year</h5>
                <div className="stripe" />
                <li>
                  <p>{project.location} ©</p>
                </li>
                <li>
                  <p>{project.year}</p>
                </li>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section case-intro-image once-in block-padding-bottom"
          data-scroll-section
        >
          <div className="container">
            <div className="row">
              <div className="flex-col">
                {project.liveUrl && (
                  <div className="btn-wrap theme-dark">
                    <div
                      className="btn btn-round"
                      data-scroll
                      data-scroll-speed="2"
                      data-scroll-position="top"
                    >
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-click magnetic"
                        data-strength="100"
                        data-strength-text="50"
                      >
                        <div className="btn-fill" />
                        <span className="btn-text">
                          <span className="btn-text-inner">
                            Live site <ArrowIcon className="arrow" />
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                )}
                <div className="single-image">
                  <div
                    className="overlay overlay-image lazy"
                    data-scroll
                    data-scroll-speed="-1"
                    style={{
                      backgroundImage: `url(${project.thumbnailUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <div
        className="footer-rounded-div"
        data-scroll-section
        style={{ marginTop: "2rem" }}
      >
        <div className="rounded-div-wrap">
          <div
            className="rounded-div"
            style={{ backgroundColor: project.thumbnailBg }}
          />
        </div>
      </div>
      <div className="footer-wrap footer-case-wrap theme-dark" data-scroll-section>
        <section
          className="section footer"
          data-scroll
          data-scroll-speed="-4"
          data-scroll-position="bottom"
          data-scroll-offset="-25%, 0%"
        >
          <div className="container medium">
            {nextProject ? (
              <Link
                href={`/work/${nextProject.slug}`}
                className="row next-case-btn"
              >
                <div className="flex-col">
                  <p>Next case</p>
                  <h2>{nextProject.titleDisplay}</h2>
                </div>
                <div className="tile-image-wrap">
                  <div className="tile-image">
                    <div
                      className="overlay overlay-image lazy"
                      data-scroll
                      data-scroll-speed="2.5"
                      data-scroll-position="bottom"
                      style={{
                        backgroundColor: nextProject.thumbnailBg,
                        backgroundPosition: "center center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundImage: `url(${nextProject.thumbnailUrl})`,
                      }}
                    />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="row next-case-btn">
                <div className="flex-col">
                  <p>Next case</p>
                  <h2>Back to all work</h2>
                </div>
              </div>
            )}
            <div className="row">
              <div className="flex-col">
                <div className="stripe" />
              </div>
            </div>
            <div className="row">
              <div className="flex-col">
                <div className="btn btn-normal">
                  <Link
                    href="/work"
                    className="btn-click magnetic"
                    data-strength="25"
                    data-strength-text="15"
                  >
                    <div className="btn-fill" />
                    <span className="btn-text">
                      <span className="btn-text-inner change">
                        All work
                        <div className="count-nr">{projects.length}</div>
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
