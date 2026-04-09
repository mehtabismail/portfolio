import type { AdminSingletonKey } from "./types";
import { parseContactPayload, parseProjectPayload, parseSitePayload, parseUserPayload } from "./schemas";
import { deleteProject, upsertProject, upsertSingleton } from "./firestore-write";
import { revalidateAllContentPaths } from "./revalidate";
import { getDefaultContactContent, getDefaultProjects, getDefaultSiteContent, getDefaultUser } from "./defaults";
import { getFirebaseAdminDb } from "@/lib/content/firebase-admin";
import type { ContactContent, Project, SiteContent, UserData } from "@/data";

export async function saveSingletonContent(key: AdminSingletonKey, rawPayload: unknown) {
  if (key === "user") {
    await upsertSingleton("user", parseUserPayload(rawPayload));
  } else if (key === "site") {
    await upsertSingleton("site", parseSitePayload(rawPayload));
  } else {
    await upsertSingleton("contact", parseContactPayload(rawPayload));
  }

  revalidateAllContentPaths();
}

export async function saveProject(rawPayload: unknown) {
  const parsed = parseProjectPayload(rawPayload);
  await upsertProject(parsed);
  revalidateAllContentPaths();
}

export async function removeProject(slug: string) {
  await deleteProject(slug);
  revalidateAllContentPaths();
}

export async function getAdminUserContent(): Promise<UserData> {
  const db = getFirebaseAdminDb();
  const snapshot = await db.collection("user").doc("main").get();
  if (!snapshot.exists) return getDefaultUser();
  return parseUserPayload(snapshot.data());
}

export async function getAdminSiteContent(): Promise<SiteContent> {
  const db = getFirebaseAdminDb();
  const snapshot = await db.collection("site").doc("main").get();
  if (!snapshot.exists) return getDefaultSiteContent();
  return parseSitePayload(snapshot.data());
}

export async function getAdminContactContent(): Promise<ContactContent> {
  const db = getFirebaseAdminDb();
  const snapshot = await db.collection("contact").doc("main").get();
  if (!snapshot.exists) return getDefaultContactContent();
  return parseContactPayload(snapshot.data());
}

export async function getAdminProjects(): Promise<Project[]> {
  const db = getFirebaseAdminDb();
  const snapshot = await db.collection("projects").orderBy("order", "asc").get();
  if (snapshot.empty) return getDefaultProjects();
  return snapshot.docs.map((doc) => parseProjectPayload(doc.data()));
}

export async function getAdminProjectBySlug(slug: string): Promise<Project | null> {
  const db = getFirebaseAdminDb();
  const snapshot = await db.collection("projects").doc(slug).get();
  if (!snapshot.exists) return null;
  return parseProjectPayload(snapshot.data());
}
