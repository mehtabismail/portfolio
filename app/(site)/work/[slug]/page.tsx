import { notFound } from "next/navigation";
import { projects } from "@/data";
import {
  getProjectBySlugContent,
  getProjectsContent,
  getUserContent,
} from "@/lib/content";
import ProjectCasePageContent from "@/components/site/ProjectCasePageContent";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [project, user] = await Promise.all([
    getProjectBySlugContent(slug),
    getUserContent(),
  ]);
  if (!project) return { title: `Project - ${user.fullName}` };
  return {
    title: `${project.titleDisplay} - ${user.fullName}`,
    description: `Helping brands thrive in the digital world. Located in ${user.location}.`,
  };
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlugContent(slug),
    getProjectsContent(),
  ]);
  if (!project) notFound();

  return (
    <ProjectCasePageContent basePath="" project={project} allProjects={allProjects} activeSlug={slug} />
  );
}
