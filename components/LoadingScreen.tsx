"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  isHome?: boolean;
  currentPage?: string;
}

const GREETINGS = [
  { text: "Hello", className: "home-active home-active-first" },
  { text: "Bonjour", className: "home-active" },
  { text: "स्वागत हे", className: "home-active" },
  { text: "Ciao", className: "home-active" },
  { text: "Olá", className: "home-active" },
  { text: "おい", className: "home-active jap" },
  { text: "Hallå", className: "home-active" },
  { text: "Guten tag", className: "home-active" },
  { text: "Hallo", className: "home-active-last" },
];

const PAGE_WORDS: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/about": "About",
  "/contact": "Contact",
  "/archive": "Archive",
};

export default function LoadingScreen({ isHome = false, currentPage = "/" }: Props) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasRun.current) return;
    hasRun.current = true;

    const tl = gsap.timeline();
    const isMobile = window.innerWidth <= 540;
    const onceIn = document.querySelectorAll("main .once-in");
    const loadingScreen = document.querySelector(".loading-screen") as HTMLElement;
    const loadingWords = document.querySelector(".loading-words") as HTMLElement;
    const roundedBottom = document.querySelector(".loading-screen .rounded-div-wrap.bottom") as HTMLElement;

    if (!loadingScreen || !loadingWords) return;

    if (isHome) {
      const homeActiveWords = document.querySelectorAll(".loading-words h2.home-active");
      const homeActiveFirst = document.querySelector(".loading-words h2.home-active-first") as HTMLElement;
      const homeActiveLast = document.querySelector(".loading-words h2.home-active-last") as HTMLElement;
      const pageWord = document.querySelector(".loading-words h2.active") as HTMLElement;

      tl.set(loadingScreen, { top: "0" });
      tl.set(onceIn, { y: isMobile ? "10vh" : "50vh" });
      tl.set(loadingWords, { opacity: 0, y: -50 });
      tl.set(roundedBottom, { height: isMobile ? "5vh" : "10vh" });
      tl.set(document.documentElement, { cursor: "wait" });

      if (pageWord) tl.set(pageWord, { display: "none" });
      tl.set(homeActiveWords, { display: "block", opacity: 0 });
      if (homeActiveFirst) tl.set(homeActiveFirst, { opacity: 1 });
      if (homeActiveLast) tl.set(homeActiveLast, { display: "block", opacity: 0 });

      tl.to(loadingWords, {
        duration: 0.8,
        opacity: 1,
        y: -50,
        ease: "power4.out",
        delay: 0.5,
      });

      tl.to(homeActiveWords, {
        duration: 0.01,
        opacity: 1,
        stagger: 0.15,
        ease: "none",
        onStart: () => {
          gsap.to(homeActiveWords, {
            duration: 0.01,
            opacity: 0,
            stagger: 0.15,
            ease: "none",
            delay: 0.15,
          });
        },
      }, "-=0.4");

      tl.to(homeActiveLast, { duration: 0.01, opacity: 1, delay: 0.15 });

      tl.to(loadingScreen, {
        duration: 0.8,
        top: "-100%",
        ease: "power4.inOut",
        delay: 0.2,
      });

      tl.to(roundedBottom, { duration: 1, height: "0vh", ease: "power4.inOut" }, "-=0.8");
      tl.to(loadingWords, { duration: 0.3, opacity: 0, ease: "linear" }, "-=0.8");
      tl.set(loadingScreen, { top: "calc(-100%)" });
      tl.set(roundedBottom, { height: "0vh" });

      tl.to(onceIn, {
        duration: 1.5,
        y: "0vh",
        stagger: 0.07,
        ease: "expo.out",
        clearProps: "transform",
      }, "-=0.8");

      tl.set(document.documentElement, { cursor: "auto" }, "-=1.2");
    } else {
      tl.set(loadingScreen, { top: "0" });
      tl.set(onceIn, { y: isMobile ? "10vh" : "50vh" });
      tl.set(loadingWords, { opacity: 1, y: -50 });
      tl.set(roundedBottom, { height: isMobile ? "5vh" : "10vh" });
      tl.set(document.documentElement, { cursor: "wait" });

      tl.to(loadingScreen, {
        duration: 0.8,
        top: "-100%",
        ease: "power4.inOut",
        delay: 0.5,
      });

      tl.to(roundedBottom, { duration: 1, height: "0vh", ease: "power4.inOut" }, "-=0.8");
      tl.to(loadingWords, { duration: 0.3, opacity: 0, ease: "linear" }, "-=0.8");
      tl.set(loadingScreen, { top: "calc(-100%)" });
      tl.set(roundedBottom, { height: "0vh" });

      tl.to(onceIn, {
        duration: 1,
        y: "0vh",
        stagger: 0.05,
        ease: "expo.out",
        clearProps: "transform",
      }, "-=0.8");

      tl.set(document.documentElement, { cursor: "auto" }, "-=0.8");
    }

    return () => {
      tl.kill();
    };
  }, [isHome]);

  const pageWordText = PAGE_WORDS[currentPage] || "Home";

  return (
    <div className="loading-screen">
      <div className="rounded-div-wrap top">
        <div className="rounded-div"></div>
      </div>
      <div className="loading-words">
        {/* Greeting words for home page */}
        {GREETINGS.map((word, index) => (
          <h2 key={index} className={word.className}>
            {word.text}
            <div className="dot"></div>
          </h2>
        ))}
        {/* Page word - shown with active class on current page */}
        <h2 className="active">
          {pageWordText}
          <div className="dot"></div>
        </h2>
        {/* All other page words */}
        <h2>Work<div className="dot"></div></h2>
        <h2>TWICE<div className="dot"></div></h2>
        <h2>The Damai<div className="dot"></div></h2>
        <h2>FABRIC™<div className="dot"></div></h2>
        <h2>Aanstekelijk<div className="dot"></div></h2>
        <h2>Base Create<div className="dot"></div></h2>
        <h2>AVVR<div className="dot"></div></h2>
        <h2>GraphicHunters<div className="dot"></div></h2>
        <h2>Future Goals<div className="dot"></div></h2>
        <h2>Atypikal<div className="dot"></div></h2>
        <h2>One:Nil<div className="dot"></div></h2>
        <h2>Andy Hardy<div className="dot"></div></h2>
        <h2>About<div className="dot"></div></h2>
        <h2>Contact<div className="dot"></div></h2>
        <h2>Success<div className="dot"></div></h2>
        <h2>Archive<div className="dot"></div></h2>
        <h2>Error<div className="dot"></div></h2>
        <h2>Styleguide<div className="dot"></div></h2>
      </div>
      <div className="rounded-div-wrap bottom">
        <div className="rounded-div"></div>
      </div>
    </div>
  );
}
