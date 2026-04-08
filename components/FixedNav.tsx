"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNav } from "./NavContext";
import type { SocialLink } from "@/data";

type Props = {
  navLinks: ReadonlyArray<{ href: string; label: string }>;
  socials: ReadonlyArray<SocialLink>;
  socialsTitle: string;
};

export default function FixedNav({ navLinks, socials, socialsTitle }: Props) {
  const pathname = usePathname();
  const { toggleNav } = useNav();

  const handleLinkClick = () => {
    toggleNav();
    const main = document.querySelector("main");
    main?.classList.remove("nav-active");
    document.querySelectorAll(".btn-hamburger, .btn-menu").forEach((el) => {
      el.classList.remove("active");
    });
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed-nav theme-dark">
      <div className="fixed-nav-rounded-div">
        <div className="rounded-div-wrap">
          <div className="rounded-div"></div>
        </div>
      </div>
      <div className="fixed-nav-inner">
        <div className="row nav-row">
          <h5>Navigation</h5>
          <div className="stripe"></div>
          <ul className="links-wrap">
            {navLinks.map(({ href, label }) => (
              <li key={href} className={`btn btn-link ${isActive(href) ? "active" : ""}`}>
                <Link
                  href={href}
                  className="btn-click magnetic"
                  data-strength="24"
                  data-strength-text="12"
                  onClick={handleLinkClick}
                >
                  <span className="btn-text">
                    <span className="btn-text-inner">{label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="row social-row">
          <div className="stripe"></div>
          <div className="socials">
            <h5>{socialsTitle}</h5>
            <ul>
              {socials.map(({ href, label }) => (
                <li key={href} className="btn btn-link btn-link-external">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-click magnetic"
                    data-strength="20"
                    data-strength-text="10"
                  >
                    <span className="btn-text">
                      <span className="btn-text-inner">{label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
