"use client";

import { useNav } from "./NavContext";

export default function HamburgerNav() {
  const { navActive, toggleNav } = useNav();

  const handleClick = () => {
    toggleNav();
    const main = document.querySelector("main");
    if (main) {
      if (!navActive) {
        main.classList.add("nav-active");
      } else {
        main.classList.remove("nav-active");
      }
    }
  };

  return (
    <div className={`btn btn-hamburger ${navActive ? "active" : ""}`}>
      <div
        className="btn-click magnetic"
        data-strength="50"
        data-strength-text="25"
        onClick={handleClick}
      >
        <div className="btn-fill"></div>
        <div className="btn-text">
          <div className="btn-bars"></div>
          <span className="btn-text-inner">Menu</span>
        </div>
      </div>
    </div>
  );
}
