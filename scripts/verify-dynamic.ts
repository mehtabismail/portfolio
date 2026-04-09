import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { loadPortfolioEnv } from "./load-portfolio-env";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function missingFields(doc: Record<string, unknown>, fields: string[]) {
  return fields.filter((f) => doc[f] === undefined);
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
  let failed = false;

  const singletonChecks: Array<{ name: "user" | "site" | "contact"; required: string[] }> = [
    { name: "user", required: ["firstName", "lastName", "fullName", "email", "socials"] },
    { name: "site", required: ["nav", "home", "common", "footer"] },
    { name: "contact", required: ["heroLine1", "heroLine2", "form", "sections"] },
  ];

  for (const { name, required } of singletonChecks) {
    const snap = await db.collection(name).doc("main").get();
    if (!snap.exists) {
      console.error(`Missing doc: ${name}/main`);
      failed = true;
      continue;
    }
    const missing = missingFields(snap.data() ?? {}, required);
    if (missing.length) {
      console.error(`Invalid ${name}/main. Missing: ${missing.join(", ")}`);
      failed = true;
    } else {
      console.log(`OK ${name}/main`);
    }
  }

  const projectsSnap = await db.collection("projects").orderBy("order", "asc").get();
  if (projectsSnap.empty) {
    console.error("No docs found in projects collection");
    failed = true;
  } else {
    const required = [
      "slug",
      "title",
      "titleDisplay",
      "location",
      "year",
      "services",
      "categories",
      "thumbnailBg",
      "thumbnailUrl",
      "order",
      "isPublished",
    ];
    for (const doc of projectsSnap.docs) {
      const data = doc.data() as Record<string, unknown>;
      const missing = missingFields(data, required);
      if (missing.length) {
        console.error(`Invalid projects/${doc.id}. Missing: ${missing.join(", ")}`);
        failed = true;
      }
      if (data.isFeatured !== undefined && typeof data.isFeatured !== "boolean") {
        console.error(`Invalid projects/${doc.id}. "isFeatured" must be boolean when provided.`);
        failed = true;
      }
    }
    console.log(`OK projects/${projectsSnap.size} docs`);
  }

  if (failed) {
    console.error("Dynamic verification failed.");
    process.exit(1);
  }
  console.log("Dynamic verification passed.");
}

main().catch((error) => {
  console.error("Dynamic verification failed:", error);
  process.exit(1);
});

