import type { NextConfig } from "next";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

const cloudinaryRemotePatterns =
  cloudName && cloudName.trim().length > 0
    ? [
        {
          protocol: "https" as const,
          hostname: "res.cloudinary.com",
          pathname: `/${cloudName}/**`,
        },
      ]
    : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: cloudinaryRemotePatterns,
  },
  async headers() {
    const base = [
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    if (process.env.NODE_ENV === "production") {
      base.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }

    return [{ source: "/:path*", headers: base }];
  },
};

export default nextConfig;
