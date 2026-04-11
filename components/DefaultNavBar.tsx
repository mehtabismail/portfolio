import Link from "next/link";
import type { SiteContent, UserData } from "@/data";
import { tenantHref } from "@/lib/platform/tenant-href";
import { getSiteContentData, getUserContent } from "@/lib/content";
import MenuButton from "./MenuButton";
import NavCreditStrip from "./NavCreditStrip";

function navSegmentKey(canonicalHref: string): string {
  if (canonicalHref === "/" || canonicalHref === "") return "home";
  return canonicalHref.replace(/^\//, "").split("/")[0] || "home";
}

type Props = {
  active: string;
  basePath?: string;
  siteContent?: SiteContent;
  user?: UserData;
  /** Shown first when the signed-in viewer owns this portfolio (e.g. Dashboard → CMS). */
  prependNav?: ReadonlyArray<{ href: string; label: string }>;
};

export default async function DefaultNavBar({
  active,
  basePath = "",
  siteContent: siteContentProp,
  user: userProp,
  prependNav,
}: Props) {
  const [siteContent, user] = await Promise.all([
    siteContentProp ? Promise.resolve(siteContentProp) : getSiteContentData(),
    userProp ? Promise.resolve(userProp) : getUserContent(),
  ]);
  const h = (path: string) => tenantHref(basePath, path);

  return (
    <div className="nav-bar">
      <div className="credits-top">
        <div className="btn btn-link btn-left-top">
          <Link href={h("/")} className="btn-click magnetic" data-strength="20" data-strength-text="10">
            <span className="btn-text">
              <NavCreditStrip firstName={user.firstName} fullName={user.fullName} />
            </span>
          </Link>
        </div>
      </div>
      <ul className="links-wrap">
        {(prependNav ?? []).map(({ href, label }) => (
          <li key={href} className="btn btn-link">
            <Link href={href} className="btn-click magnetic" data-strength="20" data-strength-text="10">
              <span className="btn-text">
                <span className="btn-text-inner">{label}</span>
              </span>
            </Link>
          </li>
        ))}
        {siteContent.nav.main.map(({ href: canonicalHref, label }) => {
          const href = h(canonicalHref);
          const key = navSegmentKey(canonicalHref);
          return (
            <li key={href} className={`btn btn-link ${active === key ? "active" : ""}`}>
              <Link href={href} className="btn-click magnetic" data-strength="20" data-strength-text="10">
                <span className="btn-text">
                  <span className="btn-text-inner">{label}</span>
                </span>
              </Link>
            </li>
          );
        })}
        <MenuButton />
      </ul>
    </div>
  );
}
