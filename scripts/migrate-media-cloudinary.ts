import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { v2 as cloudinary } from "cloudinary";
import { projects } from "../data";
import { loadPortfolioEnv } from "./load-portfolio-env";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function toLocalPath(urlPath: string) {
  const clean = urlPath.split("?")[0];
  const relative = clean.startsWith("/") ? clean.slice(1) : clean;
  return resolve(process.cwd(), "public", relative);
}

function isCloudinaryUrl(url?: string) {
  return typeof url === "string" && url.includes("res.cloudinary.com");
}

async function uploadIfNeeded(
  slug: string,
  sourceUrl: string | undefined,
  assetName: "thumbnail" | "thumbnail-hover",
  rootFolder: string,
  force = false,
) {
  if (!sourceUrl) return null;
  if (!force && isCloudinaryUrl(sourceUrl)) return sourceUrl;

  const localPath = toLocalPath(sourceUrl);
  if (!existsSync(localPath)) {
    throw new Error(`Local media not found for ${slug} (${assetName}): ${localPath}`);
  }

  const publicId = `${rootFolder}/projects/${slug}/${assetName}`;
  const result = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    unique_filename: false,
  });
  return result.secure_url;
}

async function main() {
  loadPortfolioEnv();

  const projectId = requiredEnv("FIREBASE_PROJECT_ID");
  const clientEmail = requiredEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

  const cloudName = requiredEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = requiredEnv("CLOUDINARY_API_KEY");
  const apiSecret = requiredEnv("CLOUDINARY_API_SECRET");
  const rootFolder = process.env.CLOUDINARY_ROOT_FOLDER || "dynamic-portfolio";

  const force = process.argv.includes("--force");

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  if (!getApps().length) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }

  const db = getFirestore();
  let updated = 0;

  for (const project of projects) {
    const thumbnailUrl = await uploadIfNeeded(
      project.slug,
      project.thumbnailUrl,
      "thumbnail",
      rootFolder,
      force,
    );
    const thumbnailHoverUrl = await uploadIfNeeded(
      project.slug,
      project.thumbnailHoverUrl,
      "thumbnail-hover",
      rootFolder,
      force,
    );

    await db.collection("projects").doc(project.slug).set(
      {
        thumbnailUrl: thumbnailUrl ?? project.thumbnailUrl,
        thumbnailHoverUrl: thumbnailHoverUrl ?? project.thumbnailHoverUrl ?? project.thumbnailUrl,
      },
      { merge: true },
    );
    updated += 1;
    console.log(`Updated media for ${project.slug}`);
  }

  console.log(`migrate:media-cloudinary complete. Updated ${updated} project docs.`);
}

main().catch((error) => {
  console.error("migrate:media-cloudinary failed:", error);
  process.exit(1);
});

