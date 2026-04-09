import { getFirebaseAdminDb } from "@/lib/content/firebase-admin";
import type { AdminContentPayloadMap, AdminSingletonKey } from "./types";
import type { Project } from "@/data";

function withTimestamps<T extends Record<string, unknown>>(payload: T) {
  const now = new Date().toISOString();
  return {
    ...payload,
    updatedAt: now,
    createdAt: now,
  };
}

export async function upsertSingleton<K extends AdminSingletonKey>(key: K, payload: AdminContentPayloadMap[K]) {
  const db = getFirebaseAdminDb();
  await db.collection(key).doc("main").set(withTimestamps(payload as unknown as Record<string, unknown>), { merge: true });
}

export async function upsertProject(payload: Project) {
  const db = getFirebaseAdminDb();
  await db.collection("projects").doc(payload.slug).set(withTimestamps(payload as unknown as Record<string, unknown>), { merge: true });
}

export async function deleteProject(slug: string) {
  const db = getFirebaseAdminDb();
  await db.collection("projects").doc(slug).delete();
}
