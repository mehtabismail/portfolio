"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type NavContextType = {
  navActive: boolean;
  openNav: () => void;
  closeNav: () => void;
  toggleNav: () => void;
};

const NavContext = createContext<NavContextType | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [navActive, setNavActive] = useState(false);
  const openNav = useCallback(() => setNavActive(true), []);
  const closeNav = useCallback(() => setNavActive(false), []);
  const toggleNav = useCallback(() => setNavActive((a) => !a), []);
  return (
    <NavContext.Provider value={{ navActive, openNav, closeNav, toggleNav }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
