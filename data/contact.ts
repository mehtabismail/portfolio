export interface ContactContent {
  heroLine1: string;
  heroLine2: string;
  form: {
    fieldPhone: string;
    fieldName: string;
    fieldEmail: string;
    fieldCompany: string;
    fieldService: string;
    fieldMessage: string;
    placeholderName: string;
    placeholderEmail: string;
    placeholderCompany: string;
    placeholderService: string;
    submitLabel: string;
  };
  sections: {
    contactDetails: string;
    businessDetails: string;
    socials: string;
  };
}

export const contactContent: ContactContent = {
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
};
