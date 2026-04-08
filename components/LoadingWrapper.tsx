"use client";

import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";

export default function LoadingWrapper() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="loading-container">
      <LoadingScreen isHome={isHome} currentPage={pathname} />
    </div>
  );
}
