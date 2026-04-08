import Link from "next/link";
import MenuButton from "./MenuButton";
import NavCreditStrip from "./NavCreditStrip";
import { getSiteContentData, getUserContent } from "@/lib/content";

export default async function DefaultNavBar({ active }: { active: string }) {
  const [siteContent, user] = await Promise.all([getSiteContentData(), getUserContent()]);
  return (
    <div className="nav-bar">
      <div className="credits-top">
        <div className="btn btn-link btn-left-top">
          <Link
            href="/"
            className="btn-click magnetic"
            data-strength="20"
            data-strength-text="10"
          >
            <span className="btn-text">
              <NavCreditStrip firstName={user.firstName} fullName={user.fullName} />
            </span>
          </Link>
        </div>
      </div>
      <ul className="links-wrap">
        {siteContent.nav.main.map(({ href, label }) => (
          <li
            key={href}
            className={`btn btn-link ${active === (href === "/" ? "home" : href.slice(1)) ? "active" : ""}`}
          >
            <Link
              href={href}
              className="btn-click magnetic"
              data-strength="20"
              data-strength-text="10"
            >
              <span className="btn-text">
                <span className="btn-text-inner">{label}</span>
              </span>
            </Link>
          </li>
        ))}
        <MenuButton />
      </ul>
    </div>
  );
}
