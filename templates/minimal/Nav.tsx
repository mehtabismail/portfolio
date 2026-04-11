import Link from "next/link";
import type { TemplateView } from "../types";
import styles from "./minimal.module.css";

const VIEWS: Record<string, TemplateView[]> = {
  home: ["home"],
  work: ["work", "project"],
  about: ["about"],
  contact: ["contact"],
  blogs: ["blogs", "blog"],
};

type NavProps = {
  slug: string;
  displayName: string;
  view: TemplateView;
};

export function Nav({ slug, displayName, view }: NavProps) {
  const base = `/u/${slug}`;
  const links = [
    { href: base, label: "Home", keys: VIEWS.home },
    { href: `${base}/work`, label: "Work", keys: VIEWS.work },
    { href: `${base}/about`, label: "About", keys: VIEWS.about },
    { href: `${base}/contact`, label: "Contact", keys: VIEWS.contact },
    { href: `${base}/blogs`, label: "Blog", keys: VIEWS.blogs },
  ] as const;

  return (
    <header className={styles.nav}>
      <Link href={base} className={styles.brand}>
        {displayName}
      </Link>
      <nav aria-label="Portfolio">
        <ul className={styles.navList}>
          {links.map((item) => {
            const active = item.keys.includes(view);
            return (
              <li key={item.href}>
                <Link href={item.href} className={active ? styles.navActive : styles.navLink}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
