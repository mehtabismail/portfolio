import { DefaultNavBar } from "@/components";
import { getProjectsContent, getSiteContentData, getUserContent } from "@/lib/content";
import WorkPageContent from "@/components/site/WorkPageContent";

export async function generateMetadata() {
  const user = await getUserContent();
  return {
    title: `Work - ${user.fullName}`,
    description:
      "Creating next level digital products. I help companies from all over the world (Netherlands, United States, United Kingdom, Australia, Germany etc.)",
  };
}

export default async function WorkPage() {
  const [projects, siteContent] = await Promise.all([getProjectsContent(), getSiteContentData()]);

  return <WorkPageContent projects={projects} siteContent={siteContent} />;
}
