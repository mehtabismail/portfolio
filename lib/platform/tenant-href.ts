/** Prefix owner-style paths (`/work`, `/about`) with a tenant base (`/u/[slug]`). */
export function tenantHref(basePath: string, path: string): string {
  const base = basePath.replace(/\/$/, "");
  if (!base) {
    return path && path !== "" ? path : "/";
  }
  if (!path || path === "/") {
    return base;
  }
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
