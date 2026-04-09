import type { Metadata } from "next";
import { Animations, FixedNav, HamburgerNav, LoadingWrapper, NavProvider } from "@/components";
import { getSiteContentData, getUserContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getUserContent();
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

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [siteContent, userContent] = await Promise.all([getSiteContentData(), getUserContent()]);

  return (
    <div data-barba="wrapper">
      <NavProvider>
        <div className="no-scroll-overlay"></div>
        <LoadingWrapper />
        <main className="main" id="home" data-barba="container" data-barba-namespace="home">
          <HamburgerNav />
          <div className="overlay fixed-nav-back"></div>
          <FixedNav
            navLinks={siteContent.nav.main}
            socials={userContent.socials}
            socialsTitle={siteContent.common.socialsTitle}
          />
          {children}
        </main>
        <Animations />
      </NavProvider>
    </div>
  );
}
