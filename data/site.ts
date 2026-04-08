export const siteContent = {
  nav: {
    main: [
      { href: "/", label: "Home" },
      { href: "/work", label: "Work" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  home: {
    heroRolePrefix: "Freelance",
    heroRoleSuffix: "Designer & Developer",
    introTitle:
      "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge.",
    introDescription:
      "The combination of my passion for design, code & interaction positions me in a unique place in the web design world.",
    recentWorkTitle: "Recent work",
    moreWorkLabel: "More work",
  },
  common: {
    socialsTitle: "Socials",
    versionLabel: "Version",
    versionValue: "2026 © Edition",
    localTimeLabel: "Local time",
  },
  footer: {
    ctaLine1: "Let's work",
    ctaLine2: "together",
    getInTouch: "Get in touch",
  },
  archive: {
    headerLine1: "Archive of",
    headerLine2: "past work",
    hoverLabel: "Website",
    placeholder:
      "Past projects and archive listings can be added here. This page matches the structure of the original archive.",
  },
  work: {
    headerLine1: "Creating next level",
    headerLine2: "digital products",
    archiveButtonLabel: "Archive",
  },
} as const;

export type SiteContent = typeof siteContent;
