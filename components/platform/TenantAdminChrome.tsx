"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  slug: string;
  displayName: string;
  children: ReactNode;
};

export default function TenantAdminChrome({ slug, displayName, children }: Props) {
  const pathname = usePathname();
  const base = `/dashboard/${slug}`;

  const navItems = [
    { href: base, label: "Dashboard" },
    { href: `${base}/user`, label: "User" },
    { href: `${base}/site`, label: "Site" },
    { href: `${base}/contact`, label: "Contact" },
    { href: `${base}/projects`, label: "Projects" },
    { href: `${base}/settings`, label: "Settings" },
  ] as const;

  function navLinkClass(href: string) {
    const active =
      href === base ? pathname === base : pathname === href || pathname.startsWith(`${href}/`);
    return `admin-app__nav-link${active ? " admin-app__nav-link--active" : ""}`;
  }

  return (
    <div className="admin-app">
      <div className="admin-app__shell">
        <aside className="admin-app__sidebar">
          <div className="admin-app__sidebar-brand">
            <span className="admin-app__sidebar-logo">P</span>
            <div>
              <div className="admin-app__sidebar-title">Portfolio CMS</div>
              <div className="admin-app__sidebar-sub">
                Content &amp; media · {displayName} ·{" "}
                <Link href={`/u/${slug}`} style={{ textDecoration: "underline", color: "inherit" }}>
                  View site
                </Link>
              </div>
            </div>
          </div>

          <nav className="admin-app__nav" aria-label="Admin">
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href} className={navLinkClass(href)}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="admin-app__sidebar-footer">
            <form action="/api/platform/logout" method="POST">
              <button type="submit" className="admin-app__logout">
                Log out
              </button>
            </form>
          </div>
        </aside>

        <div className="admin-app__main">
          <div className="admin-app__main-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
