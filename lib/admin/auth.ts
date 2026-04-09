import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "portfolio_admin_session";

type SessionPayload = {
  exp: number;
};

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET");
  }
  return secret;
}

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SECRET");
  }
  return secret;
}

function base64UrlEncode(input: string): string {
  if (typeof btoa === "function") {
    return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64UrlDecode(input: string): string {
  if (typeof atob === "function") {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
    return atob(padded);
  }
  return Buffer.from(input, "base64url").toString("utf8");
}

async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  const bytes = new Uint8Array(digest);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return base64UrlEncode(binary);
}

async function signPayload(payload: string): Promise<string> {
  return sha256(`${payload}.${getSessionSecret()}`);
}

export function getSessionTtlSeconds(): number {
  const hours = Number(process.env.ADMIN_SESSION_TTL_HOURS ?? "12");
  return Math.max(1, hours) * 60 * 60;
}

export function validateAdminSecret(input: string): boolean {
  return input === getAdminSecret();
}

export async function createAdminSessionValue(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { exp: now + getSessionTtlSeconds() };
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = await signPayload(payloadB64);
  return `${payloadB64}.${signature}`;
}

export async function verifyAdminSessionValue(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const [payloadB64, signature] = value.split(".");
  if (!payloadB64 || !signature) return false;

  const expected = await signPayload(payloadB64);
  if (expected !== signature) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64)) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    return typeof payload.exp === "number" && payload.exp > now;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticatedFromCookies(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionValue(token);
}

export async function isAdminAuthenticatedFromRequest(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const cookiePart = parts.find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  if (!cookiePart) return false;
  const token = decodeURIComponent(cookiePart.substring(`${ADMIN_SESSION_COOKIE}=`.length));
  return verifyAdminSessionValue(token);
}
