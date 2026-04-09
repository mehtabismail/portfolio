"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/user", label: "User" },
  { href: "/admin/site", label: "Site" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/projects", label: "Projects" },
] as const;

function navLinkClass(pathname: string, href: string) {
  const active =
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);
  return `admin-app__nav-link${active ? " admin-app__nav-link--active" : ""}`;
}

export default function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <div className="admin-app admin-app--login">{children}</div>;
  }

  return (
    <div className="admin-app">
      <div className="admin-app__shell">
        <aside className="admin-app__sidebar">
          <div className="admin-app__sidebar-brand">
            <span className="admin-app__sidebar-logo">P</span>
            <div>
              <div className="admin-app__sidebar-title">Portfolio CMS</div>
              <div className="admin-app__sidebar-sub">Content &amp; media</div>
            </div>
          </div>

          <nav className="admin-app__nav" aria-label="Admin">
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href} className={navLinkClass(pathname, href)}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="admin-app__sidebar-footer">
            <form action="/api/admin/logout" method="POST">
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
