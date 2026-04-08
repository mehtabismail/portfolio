export const contactContent = {
  heroLine1: "Let's start a",
  heroLine2: "project together",
  form: {
    fieldPhone: "Phone Number",
    fieldName: "What's your name?",
    fieldEmail: "What's your email?",
    fieldCompany: "What's the name of your organization?",
    fieldService: "What services are you looking for?",
    fieldMessage: "Your message",
    placeholderName: "John Doe *",
    placeholderEmail: "john@doe.com *",
    placeholderCompany: "John & Doe ®",
    placeholderService: "Web Design, Web Development ...",
    submitLabel: "Send it!",
  },
  sections: {
    contactDetails: "Contact Details",
    businessDetails: "Business Details",
    socials: "Socials",
  },
} as const;

export type ContactContent = typeof contactContent;
