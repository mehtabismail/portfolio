import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { loadPortfolioEnv } from "./load-portfolio-env";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function isLikelyUrl(value: unknown) {
  if (typeof value !== "string" || !value.length) return false;
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/");
}

function isCloudinaryUrl(value: unknown) {
  return typeof value === "string" && value.includes("res.cloudinary.com");
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
  const snapshot = await db.collection("projects").orderBy("order", "asc").get();

  if (snapshot.empty) {
    throw new Error("No project docs found in Firestore.");
  }

  let hasErrors = false;
  let cloudinaryThumbs = 0;
  let cloudinaryHovers = 0;

  for (const doc of snapshot.docs) {
    const p = doc.data() as Record<string, unknown>;
    const id = doc.id;

    if (!isLikelyUrl(p.thumbnailUrl)) {
      console.error(`projects/${id}: invalid or missing thumbnailUrl`);
      hasErrors = true;
    } else if (isCloudinaryUrl(p.thumbnailUrl)) {
      cloudinaryThumbs += 1;
    }

    if (!isLikelyUrl(p.thumbnailHoverUrl)) {
      console.error(`projects/${id}: invalid or missing thumbnailHoverUrl`);
      hasErrors = true;
    } else if (isCloudinaryUrl(p.thumbnailHoverUrl)) {
      cloudinaryHovers += 1;
    }

    if (p.heroImageUrl !== undefined && !isLikelyUrl(p.heroImageUrl)) {
      console.error(`projects/${id}: heroImageUrl exists but is invalid`);
      hasErrors = true;
    }

    if (p.videoUrl !== undefined && !isLikelyUrl(p.videoUrl)) {
      console.error(`projects/${id}: videoUrl exists but is invalid`);
      hasErrors = true;
    }

    if (p.gallery !== undefined) {
      if (!Array.isArray(p.gallery) || p.gallery.some((u) => !isLikelyUrl(u))) {
        console.error(`projects/${id}: gallery exists but contains invalid URLs`);
        hasErrors = true;
      }
    }
  }

  console.log(`Checked ${snapshot.size} projects`);
  console.log(`Cloudinary thumbnailUrl coverage: ${cloudinaryThumbs}/${snapshot.size}`);
  console.log(`Cloudinary thumbnailHoverUrl coverage: ${cloudinaryHovers}/${snapshot.size}`);

  if (hasErrors) {
    process.exit(1);
  }
  console.log("Media verification passed.");
}

main().catch((error) => {
  console.error("verify:media failed:", error);
  process.exit(1);
});

