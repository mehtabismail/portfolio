import Link from "next/link";
import ArrowIcon from "./ArrowIcon";
import { getSiteContentData, getUserContent } from "@/lib/content";

export default async function Footer() {
  const [siteContent, user] = await Promise.all([getSiteContentData(), getUserContent()]);
  return (
    <>
      <div className="footer-rounded-div" data-scroll-section>
        <div className="rounded-div-wrap">
          <div className="rounded-div" />
        </div>
      </div>
      <div className="footer-wrap footer-footer-wrap theme-dark" data-scroll-section>
        <footer className="section footer" data-scroll data-scroll-speed="-4" data-scroll-position="bottom">
          <div className="container medium">
            <div className="row">
              <div className="flex-col">
                <ArrowIcon className="arrow" />
                <h2>
                  <span>
                    <div className="profile-picture" /> {siteContent.footer.ctaLine1}{" "}
                  </span>
                  <span>{siteContent.footer.ctaLine2}</span>
                </h2>
              </div>
            </div>
            <div className="row">
              <div className="flex-col">
                <div className="stripe" />
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
                      href="/contact"
                      className="btn-click magnetic"
                      data-strength="100"
                      data-strength-text="50"
                    >
                      <div className="btn-fill" />
                      <span className="btn-text">
                        <span className="btn-text-inner">{siteContent.footer.getInTouch}</span>
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
                    <div className="btn-fill" />
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
                    <div className="btn-fill" />
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
                <div className="credits">
                  <h5>{siteContent.common.versionLabel}</h5>
                  <p>{siteContent.common.versionValue}</p>
                </div>
                <div className="time">
                  <h5>{siteContent.common.localTimeLabel}</h5>
                  <p>
                    <span id="timeSpan">--:--</span>
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
                  <div className="stripe" />
                </div>
              </div>
            </div>
          </div>
        </footer>
        <div className="overlay overlay-gradient" />
      </div>
    </>
  );
}
