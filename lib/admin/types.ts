import type { ContactContent, Project, SiteContent, UserData } from "@/data";

export type AdminSingletonKey = "user" | "site" | "contact";

export type EditableUserData = UserData;
export type EditableSiteContent = SiteContent;
export type EditableContactContent = ContactContent;
export type EditableProject = Project;

export type AdminContentPayloadMap = {
  user: EditableUserData;
  site: EditableSiteContent;
  contact: EditableContactContent;
};
