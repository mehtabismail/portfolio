import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { loadPortfolioEnv } from "./load-portfolio-env";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

async function main() {
  loadPortfolioEnv();

  const projectId = requiredEnv("FIREBASE_PROJECT_ID");
  const clientEmail = requiredEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId });
  }

  const db = getFirestore();
  const snapshot = await db.collection("projects").get();
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data() as Record<string, unknown>;
    const thumbnailUrl = typeof data.thumbnailUrl === "string" ? data.thumbnailUrl : undefined;
    if (!thumbnailUrl) continue;

    const patch: Record<string, unknown> = {};
    if (!data.heroImageUrl) patch.heroImageUrl = thumbnailUrl;
    if (!Array.isArray(data.gallery) || data.gallery.length === 0) patch.gallery = [thumbnailUrl];
    if (data.isPublished === undefined) patch.isPublished = true;

    if (Object.keys(patch).length > 0) {
      await db.collection("projects").doc(doc.id).set(patch, { merge: true });
      updated += 1;
    }
  }

  console.log(`sync:media-placeholders complete. Updated ${updated} project docs.`);
}

main().catch((error) => {
  console.error("sync:media-placeholders failed:", error);
  process.exit(1);
});

