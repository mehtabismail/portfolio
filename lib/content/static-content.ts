import { contactContent, projects, siteContent, user } from "@/data";
import type { ContactContent, Project, SiteContent, UserData } from "@/data";

export async function getStaticUser(): Promise<UserData> {
  return user;
}

export async function getStaticSiteContent(): Promise<SiteContent> {
  return siteContent;
}

export async function getStaticContactContent(): Promise<ContactContent> {
  return contactContent;
}

export async function getStaticProjects(): Promise<Project[]> {
  return projects.filter((project) => project.isPublished !== false);
}

export async function getStaticProjectBySlug(slug: string): Promise<Project | null> {
  const project = projects.find((item) => item.slug === slug);
  if (!project || project.isPublished === false) return null;
  return project;
}

export async function getStaticFeaturedProjects(count = 4): Promise<Project[]> {
  return projects.slice(0, count);
}

