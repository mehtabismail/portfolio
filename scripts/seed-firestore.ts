import { cert, getApps, initializeApp } from "firebase-admin/app";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
import { contactContent, projects, siteContent, user } from "../data";
import { loadPortfolioEnv } from "./load-portfolio-env";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

async function main() {
  loadPortfolioEnv();

  const projectId = requiredEnv("FIREBASE_PROJECT_ID");
  const clientEmail = requiredEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

  if (!getApps().length) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }

  const db = getFirestore();
  const now = Timestamp.now();

  async function upsertWithTimestamps(
    collectionName: string,
    docId: string,
    payload: Record<string, unknown>,
  ) {
    const ref = db.collection(collectionName).doc(docId);
    const existing = await ref.get();
    await ref.set(
      {
        ...payload,
        createdAt: existing.exists ? existing.get("createdAt") ?? now : now,
        updatedAt: now,
      },
      { merge: true },
    );
  }

  await upsertWithTimestamps("user", "main", user as unknown as Record<string, unknown>);
  await upsertWithTimestamps("site", "main", siteContent as unknown as Record<string, unknown>);
  await upsertWithTimestamps("contact", "main", contactContent as unknown as Record<string, unknown>);

  for (const project of projects) {
    await upsertWithTimestamps("projects", project.slug, {
      ...project,
      isPublished: project.isPublished ?? true,
    });
  }

  console.log("Seed complete:");
  console.log(`- user/main`);
  console.log(`- site/main`);
  console.log(`- contact/main`);
  console.log(`- projects/${projects.length} docs`);
}

main().catch((error) => {
  console.error("Firestore seed failed:", error);
  process.exit(1);
});

