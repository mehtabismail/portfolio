import fs from "node:fs/promises";
import path from "node:path";
import LandingPageEnhancer from "./LandingPageEnhancer";
import {
  LandingBlogSection,
  LandingComparison,
  LandingExplorer,
  LandingFeatures,
  LandingFinalCta,
  LandingFooter,
  LandingHero,
  LandingHowItWorks,
  LandingNavbar,
  LandingRoadmap,
  LandingSocialProof,
} from "./LandingSections";

function extractSection(html: string, startTag: string, endTag: string) {
  const start = html.indexOf(startTag);
  if (start === -1) return "";
  const from = start + startTag.length;
  const end = html.indexOf(endTag, from);
  if (end === -1) return "";
  return html.slice(from, end).trim();
}

export default async function LandingPage() {
  const htmlPath = path.join(process.cwd(), "public", "landing-page-concept.html");
  const rawHtml = await fs.readFile(htmlPath, "utf8");

  const css = extractSection(rawHtml, "<style>", "</style>");

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <LandingPageEnhancer />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .landing-root {
              --bg: #0a0a0f;
              --bg2: #111118;
              --bg3: #16161f;
              --accent: #7c6dfa;
              --accent2: #e8645a;
              --accent3: #3ecf8e;
              --text: #f0eeff;
              --text2: #9b97b8;
              --text3: #5a5878;
              --border: rgba(255,255,255,0.07);
              --border2: rgba(255,255,255,0.12);
              --card: rgba(255,255,255,0.03);
              background: var(--bg);
              color: var(--text);
              font-family: "DM Sans", sans-serif;
              font-size: 16px;
              line-height: 1.6;
              overflow-x: hidden;
              min-height: 100vh;
              width: 100%;
              position: relative;
            }
            .landing-root h1,
            .landing-root h2,
            .landing-root h3,
            .landing-root h4 {
              font-family: "Syne", sans-serif;
              line-height: 1.15;
            }
          `,
        }}
      />
      <div className="landing-root">
        <LandingNavbar />
        <LandingHero />
        <LandingSocialProof />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingExplorer />
        <LandingBlogSection />
        <LandingRoadmap />
        <LandingComparison />
        <LandingFinalCta />
        <LandingFooter />
      </div>
    </>
  );
}
