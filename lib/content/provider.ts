import type { ContactContent, Project, SiteContent, UserData } from "@/data";
import { cache } from "react";
import { getContentMode, shouldFallbackToStatic } from "./content-mode";
import {
  getStaticContactContent,
  getStaticFeaturedProjects,
  getStaticProjectBySlug,
  getStaticProjects,
  getStaticSiteContent,
  getStaticUser,
} from "./static-content";
import {
  getDynamicContactContent,
  getDynamicFeaturedProjects,
  getDynamicProjectBySlug,
  getDynamicProjects,
  getDynamicSiteContent,
  getDynamicUser,
} from "./dynamic-content";

async function runWithModeFallback<T>(
  dynamicFn: () => Promise<T>,
  staticFn: () => Promise<T>,
  label: string,
): Promise<T> {
  if (getContentMode() !== "dynamic") {
    return staticFn();
  }
  try {
    return await dynamicFn();
  } catch (error) {
    if (!shouldFallbackToStatic()) throw error;
    console.warn(`[content-provider] ${label} failed in dynamic mode, using static fallback.`, error);
    return staticFn();
  }
}

/** Dedupe identical content fetches within one navigation (layout + page + metadata). */
export const getUserContent = cache(async () => {
  return runWithModeFallback(getDynamicUser, getStaticUser, "user");
});

export const getSiteContentData = cache(async () => {
  return runWithModeFallback(getDynamicSiteContent, getStaticSiteContent, "site");
});

export const getContactContentData = cache(async () => {
  return runWithModeFallback(getDynamicContactContent, getStaticContactContent, "contact");
});

export const getProjectsContent = cache(async () => {
  return runWithModeFallback(getDynamicProjects, getStaticProjects, "projects");
});

export const getProjectBySlugContent = cache(async (slug: string) => {
  return runWithModeFallback(
    () => getDynamicProjectBySlug(slug),
    () => getStaticProjectBySlug(slug),
    `project:${slug}`,
  );
});

export const getFeaturedProjectsContent = cache(async (count = 4) => {
  return runWithModeFallback(
    () => getDynamicFeaturedProjects(count),
    () => getStaticFeaturedProjects(count),
    "featured-projects",
  );
});

