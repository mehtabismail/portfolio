import AboutPageContent from "@/components/site/AboutPageContent";
import { getUserContent } from "@/lib/content";

export async function generateMetadata() {
  const user = await getUserContent();
  return {
    title: `About - ${user.fullName}`,
    description: `Helping brands thrive in the digital world. From my office in ${user.location} I help companies with Digital Design, Front-End Development & Interaction.`,
  };
}

export default function AboutPage() {
  return <AboutPageContent />;
}
