"use client";

import { useEffect } from "react";

export default function LandingPageEnhancer() {
  useEffect(() => {
    const root = document.querySelector(".landing-root");
    if (!root) return;

    const revealElements = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    const counters = Array.from(root.querySelectorAll<HTMLElement>(".counter-num"));
    const bentoCards = Array.from(root.querySelectorAll<HTMLElement>(".bento-card"));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );
    revealElements.forEach((el) => revealObserver.observe(el));

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = Number(el.dataset.target || 0);
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;
          const timer = window.setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              window.clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString();
          }, 16);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((el) => counterObserver.observe(el));

    const cleanupFns: Array<() => void> = [];
    bentoCards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(124,109,250,0.08), var(--bg3) 60%)`;
      };
      const onLeave = () => {
        card.style.background = "";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanupFns.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
