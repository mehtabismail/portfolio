import { contactContent, projects, siteContent, user } from "@/data";
import type { EditableContactContent, EditableProject, EditableSiteContent, EditableUserData } from "./types";

export function getDefaultUser(): EditableUserData {
  return structuredClone(user);
}

export function getDefaultSiteContent(): EditableSiteContent {
  return structuredClone(siteContent);
}

export function getDefaultContactContent(): EditableContactContent {
  return structuredClone(contactContent);
}

export function getDefaultProjects(): EditableProject[] {
  return structuredClone(projects);
}
