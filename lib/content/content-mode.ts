export type ContentMode = "static" | "dynamic";

function normalizeMode(value?: string): ContentMode {
  return value?.toLowerCase() === "dynamic" ? "dynamic" : "static";
}

export function getContentMode(): ContentMode {
  return normalizeMode(
    process.env.NEXT_PUBLIC_CONTENT_MODE ?? process.env.CONTENT_MODE ?? "static",
  );
}

export function shouldFallbackToStatic(): boolean {
  const value =
    process.env.NEXT_PUBLIC_DYNAMIC_FALLBACK_TO_STATIC ??
    process.env.DYNAMIC_FALLBACK_TO_STATIC ??
    "true";
  return value.toLowerCase() === "true";
}

