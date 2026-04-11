import { v2 as cloudinary } from "cloudinary";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) throw new Error(`Missing ${name}`);
  return v.trim();
}

function ensureConfigured() {
  cloudinary.config({
    cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: requireEnv("CLOUDINARY_API_KEY"),
    api_secret: requireEnv("CLOUDINARY_API_SECRET"),
    secure: true,
  });
}

const rootFolder = () => process.env.CLOUDINARY_ROOT_FOLDER?.trim() || "dynamic-portfolio";

/**
 * Upload a single image for a platform user. Returns HTTPS URL (Cloudinary `secure_url`).
 */
export async function uploadPlatformUserImage(
  buffer: Buffer,
  portfolioSlug: string,
  assetKey: string,
): Promise<string> {
  ensureConfigured();
  const folder = `${rootFolder()}/platform-users/${portfolioSlug}`;
  const publicId = `${folder}/${assetKey}`.replace(/\/+/g, "/");

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, res) => {
        if (error || !res) reject(error ?? new Error("Cloudinary upload failed"));
        else resolve(res);
      },
    );
    stream.end(buffer);
  });

  return result.secure_url;
}
