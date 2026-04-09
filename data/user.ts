export type SocialLink = {
  label: string;
  href: string;
};

export interface UserData {
  firstName: string;
  lastName: string;
  fullName: string;
  legalName: string;
  role: string;
  location: string;
  email: string;
  phoneRaw: string;
  phoneDisplay: string;
  coc: string;
  vat: string;
  site: {
    title: string;
    description: string;
  };
  socials: SocialLink[];
}

export const user: UserData = {
  firstName: "Mehtab",
  lastName: "Ismail",
  fullName: "Mehtab Ismail",
  legalName: "Mehtab Ismail M.I.",
  role: "Freelance Designer & Developer",
  location: "The Netherlands",
  email: "mehtabismail.dev@gmail.com",
  phoneRaw: "+923264169751",
  phoneDisplay: "+92 326 4169751",
  coc: "92411711",
  vat: "NL866034080B01",
  site: {
    title: "Mehtab Ismail • Freelance Designer & Developer",
    description:
      "Helping brands thrive in the digital world. Located in The Netherlands. Delivering tailor-made digital designs and building interactive websites from scratch. © Code by Mehtab",
  },
  socials: [
    { label: "Awwwards", href: "https://www.linkedin.com/in/mehtabismail/" },
    { label: "Instagram", href: "https://www.instagram.com/mehtabismail/" },
    { label: "Twitter", href: "https://twitter.com/mehtabismail" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/mehtabismail/",
    },
  ],
};
