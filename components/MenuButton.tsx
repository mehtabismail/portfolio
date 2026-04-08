"use client";

import { useNav } from "./NavContext";

export default function MenuButton() {
  const { navActive, toggleNav } = useNav();

  const handleClick = () => {
    toggleNav();
    const main = document.querySelector("main");
    if (main) {
      if (!navActive) {
        main.classList.add("nav-active");
        document.querySelector(".btn-hamburger")?.classList.add("active");
      } else {
        main.classList.remove("nav-active");
        document.querySelector(".btn-hamburger")?.classList.remove("active");
      }
    }
  };

  return (
    <li className="btn btn-link btn-menu">
      <div
        className="btn-click magnetic"
        data-strength="20"
        data-strength-text="10"
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        role="button"
        tabIndex={0}
        aria-label="Open menu"
      >
        <div className="btn-text">
          <span className="btn-text-inner">Menu</span>
        </div>
      </div>
    </li>
  );
}
