"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default function ClientInit({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<unknown>(null);

  const initLenis = useCallback(() => {
    if (typeof window === "undefined") return;
    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({ lerp: 0.08 });
      lenisRef.current = lenis;
      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const main = document.querySelector("main");
    main?.classList.toggle("touch", isTouch);
    main?.classList.toggle("no-touch", !isTouch);

    const onScroll = () => {
      main?.classList.toggle("scrolled", window.scrollY > 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body?.classList.remove("is-loading");
    initLenis();

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (lenisRef.current && typeof (lenisRef.current as { destroy: () => void }).destroy === "function") {
        (lenisRef.current as { destroy: () => void }).destroy();
      }
    };
  }, [pathname, initLenis]);

  // Magnetic buttons
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth <= 540) return;
    const magnets = document.querySelectorAll(".magnetic");
    const moveMagnet = (e: Event) => {
      const ev = e as MouseEvent;
      const magnet = ev.currentTarget as HTMLElement;
      const rect = magnet.getBoundingClientRect();
      const strength = parseInt(magnet.getAttribute("data-strength") || "50", 10);
      const x = ((ev.clientX - rect.left) / magnet.offsetWidth - 0.5) * strength;
      const y = ((ev.clientY - rect.top) / magnet.offsetHeight - 0.5) * strength;
      gsap.to(magnet, { x, y, duration: 1.5, ease: "power4.out" });
      const text = magnet.querySelector(".btn-text");
      if (text) gsap.to(text, { x: x * 0.5, y: y * 0.5, duration: 1.5, ease: "power4.out" });
    };
    magnets.forEach((magnet) => {
      magnet.addEventListener("mousemove", moveMagnet as EventListener);
      magnet.addEventListener("mouseleave", () => {
        gsap.to(magnet, { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
        const text = magnet.querySelector(".btn-text");
        if (text) gsap.to(text, { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
      });
    });
    return () => {
      magnets.forEach((magnet) => {
        magnet.removeEventListener("mousemove", moveMagnet);
      });
    };
  }, [pathname]);

  // Local time in footer
  useEffect(() => {
    const el = document.getElementById("timeSpan");
    if (!el) return;
    const format = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      el.textContent = `${h12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ampm} CET`;
    };
    format();
    const id = setInterval(format, 60000);
    return () => clearInterval(id);
  }, [pathname]);

  return <>{children}</>;
}
