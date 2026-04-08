import type { Metadata } from "next";
import { Animations, FixedNav, HamburgerNav, LoadingWrapper, NavProvider } from "@/components";
import { getSiteContentData, getUserContent } from "@/lib/content";
import "./globals.css";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [siteContent, userContent] = await Promise.all([getSiteContentData(), getUserContent()]);

  return (
    <html lang="en">
      <head>
        <link rel="preload" as="font" href="/assets/fonts/NeueMontreal-Regular.otf" type="font/otf" crossOrigin="anonymous" />
        <link href="/assets/css/normalize.css" rel="stylesheet" />
        <link href="/assets/css/locomotive-scroll.css" rel="stylesheet" />
        <link href="/assets/css/styleguide.css" rel="stylesheet" />
        <link href="/assets/css/components.css" rel="stylesheet" />
        <link href="/assets/css/style-new.css" rel="stylesheet" />
      </head>
      <body data-barba="wrapper">
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
      </body>
    </html>
  );
}
