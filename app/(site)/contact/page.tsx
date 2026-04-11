import ContactPageContent from "@/components/site/ContactPageContent";
import { getUserContent } from "@/lib/content";

export async function generateMetadata() {
  const user = await getUserContent();
  return {
    title: `Contact - ${user.fullName}`,
    description: `Let's start a project together. Reach out via email or hop on a call. I work with companies from all over the world from my office in ${user.location}.`,
  };
}

export default async function ContactPage() {
  return <ContactPageContent />;
}
