import { DefaultNavBar } from "@/components";
import type { SiteContent, UserData } from "@/data";

type Props = {
  basePath?: string;
  siteContent?: SiteContent;
  user?: UserData;
  prependNav?: ReadonlyArray<{ href: string; label: string }>;
};

export default async function AboutPageContent({ basePath = "", siteContent, user, prependNav }: Props) {
  return (
    <div className="main-wrap" data-scroll-container>
      <header className="section default-header about-header once-in" data-scroll-section>
        <DefaultNavBar
          active="about"
          basePath={basePath}
          siteContent={siteContent}
          user={user}
          prependNav={prependNav}
        />
        <div className="container medium once-in">
          <div className="row">
            <div className="flex-col">
              <h1>
                <span>Helping brands thrive </span>
                <span>in the digital world</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <section className="section no-padding line-globe once-in" data-scroll-section>
        <div className="container medium">
          <div className="row">
            <div className="flex-col">
              <div className="stripe" />
              <div className="digital-ball">
                <div className="overlay" />
                <div className="globe">
                  <div className="globe-wrap">
                    <div className="circle" />
                    <div className="circle" />
                    <div className="circle" />
                    <div className="circle-hor" />
                    <div className="circle-hor-middle" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-image once-in" data-scroll-section>
        <div className="bottom-lightgray" />
        <div className="container">
          <div className="row">
            <div className="flex-col">
              <div className="arrow">
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <g stroke="currentColor" strokeWidth="1.5" fill="none">
                    <polyline points="2.77 0 12 0 12 9.23" />
                    <line x1="12" y1="0" x2="0" y2="12" />
                  </g>
                </svg>
              </div>
              <p
                data-scroll
                data-scroll-speed="-1"
                data-scroll-position="top"
                data-scroll-offset="0%, -50%"
              >
                I help companies from all over the world with tailor-made solutions. With each project, I push my work
                to new horizons, always putting quality first.
              </p>
              <p
                data-scroll
                data-scroll-speed="-1"
                data-scroll-position="top"
                data-scroll-offset="0%, -50%"
              >
                <span style={{ opacity: 0.5, display: "block", paddingTop: "0.5em" }}>
                  Always exploring<span className="animate-dot">.</span>
                  <span className="animate-dot">.</span>
                  <span className="animate-dot">.</span>
                </span>
              </p>
            </div>
            <div className="flex-col">
              <div className="single-about-image">
                <div
                  className="overlay overlay-image"
                  data-scroll
                  data-scroll-speed="-2"
                  data-scroll-position="top"
                />
                <div className="overlay" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-services once-in" data-scroll-section>
        <div className="container">
          <div className="row">
            <div className="flex-col">
              <h2>
                I can help you with <span className="animate-dot">.</span>
                <span className="animate-dot">.</span>
                <span className="animate-dot">.</span>
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="flex-col">
              <h5>01</h5>
              <div className="stripe" />
              <h4>Design</h4>
              <p>
                With a solid track record in designing websites, I deliver strong and user-friendly digital designs.
                (Since 2024 only in combination with development)
              </p>
            </div>
            <div className="flex-col">
              <h5>02</h5>
              <div className="stripe" />
              <h4>Development</h4>
              <p>
                I build scalable websites from scratch that fit seamlessly with design. My focus is on micro
                animations, transitions and interaction. Building with Webflow (or Kirby CMS).
              </p>
            </div>
            <div className="flex-col">
              <h5>03</h5>
              <div className="stripe" />
              <h4>
                <span>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <path
                      d="M99.17 50C71.94 50.45 50 72.66 50 100H49.99C49.55 71.94 27.34 50 0 50v-.83C28.06 49.55 50 27.34 50 0h.01c.44 28.06 22.66 50 49.83 50.83z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                The full package
              </h4>
              <p>
                A complete website from concept to implementation, that&apos;s what makes me stand out. My great sense
                for design and my development skills enable me to create kick-ass projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-awwwards once-in" data-scroll-section>
        <div className="container medium">
          <div className="row">
            <div className="flex-col">
              <div className="single-image">
                <div className="overlay" data-scroll data-scroll-speed="-1" />
                <div className="overlay" />
              </div>
            </div>
            <div className="flex-col">
              <div className="awwwards-badge">
                <svg width="102" height="101" viewBox="0 0 102 101" />
                <svg width="49" height="30" viewBox="0 0 49 30" />
              </div>
              <h2>
                Awwwards
                <br />
                judge &apos;19-25
              </h2>
              <p>
                I am a proud member of the Awwwards International Jury, where I judge the best websites in the world
                using my expertise as a designer and developer. Micro animations and transitions have my full attention
                and get me thrilled with every move.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
