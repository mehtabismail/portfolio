"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function Animations() {
  const pathname = usePathname();
  const initialized = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);

  const initMagneticButtons = useCallback(() => {
    if (typeof window === "undefined" || window.innerWidth <= 540) return;

    const magnets = document.querySelectorAll(".magnetic");

    magnets.forEach((magnet) => {
      const el = magnet as HTMLElement;

      const onMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const strength = parseInt(el.getAttribute("data-strength") || "50", 10);
        const strengthText = parseInt(el.getAttribute("data-strength-text") || "25", 10);
        const x = ((e.clientX - rect.left) / el.offsetWidth - 0.5) * strength;
        const y = ((e.clientY - rect.top) / el.offsetHeight - 0.5) * strength;

        gsap.to(el, {
          x,
          y,
          rotate: 0.001,
          duration: 1.5,
          ease: "power4.out",
        });

        const btnText = el.querySelector(".btn-text");
        if (btnText) {
          gsap.to(btnText, {
            x: ((e.clientX - rect.left) / el.offsetWidth - 0.5) * strengthText,
            y: ((e.clientY - rect.top) / el.offsetHeight - 0.5) * strengthText,
            rotate: 0.001,
            duration: 1.5,
            ease: "power4.out",
          });
        }
      };

      const onMouseLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
        const btnText = el.querySelector(".btn-text");
        if (btnText) {
          gsap.to(btnText, { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
        }
      };

      const onMouseEnter = () => {
        const btnFill = el.querySelector(".btn-fill");
        if (btnFill) {
          gsap.to(btnFill, { y: "0%", duration: 0.6, ease: "power2.inOut" });
        }
        const btnTextInner = el.querySelector(".btn-text-inner.change");
        if (btnTextInner) {
          gsap.to(btnTextInner, { color: "#FFFFFF", duration: 0.3, ease: "power3.in" });
        }
      };

      const onMouseLeaveBtn = () => {
        const btnFill = el.querySelector(".btn-fill");
        if (btnFill) {
          gsap.to(btnFill, { y: "-100%", duration: 0.6, ease: "power2.inOut" });
        }
        const btnTextInner = el.querySelector(".btn-text-inner.change");
        if (btnTextInner) {
          gsap.to(btnTextInner, { color: "#1C1D20", duration: 0.3, ease: "power3.out", delay: 0.3 });
        }
      };

      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseleave", onMouseLeave);
      if (el.classList.contains("btn-click")) {
        el.addEventListener("mouseenter", onMouseEnter);
        el.addEventListener("mouseleave", onMouseLeaveBtn);
      }
    });
  }, []);

  const initHoverImagePreview = useCallback(() => {
    if (typeof window === "undefined") return;

    const cursorImage = document.querySelector(".mouse-pos-list-image") as HTMLElement;
    const cursorBtn = document.querySelector(".mouse-pos-list-btn") as HTMLElement;
    const cursorSpan = document.querySelector(".mouse-pos-list-span") as HTMLElement;

    if (!cursorImage && !cursorBtn) return;

    let posXImage = 0, posYImage = 0;
    let posXBtn = 0, posYBtn = 0;
    let posXSpan = 0, posYSpan = 0;
    let mouseX = 0, mouseY = 0;

    const onFrame = () => {
      if (cursorImage) {
        posXImage += (mouseX - posXImage) / 12;
        posYImage += (mouseY - posYImage) / 12;
        gsap.set(cursorImage, { left: posXImage, top: posYImage });
      }
      if (cursorBtn) {
        posXBtn += (mouseX - posXBtn) / 7;
        posYBtn += (mouseY - posYBtn) / 7;
        gsap.set(cursorBtn, { left: posXBtn, top: posYBtn });
      }
      if (cursorSpan) {
        posXSpan += (mouseX - posXSpan) / 6;
        posYSpan += (mouseY - posYSpan) / 6;
        gsap.set(cursorSpan, { left: posXSpan, top: posYSpan });
      }
    };

    gsap.ticker.add(onFrame);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);

    // Event delegation: work items hover and thumbnail index (works for any number of projects / filters)
    const onWorkWrapMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const wrap = target.closest(".mouse-pos-list-image-wrap");
      if (!wrap) return;
      cursorImage?.classList.add("active");
      cursorBtn?.classList.add("active");
      cursorSpan?.classList.add("active");
      const li = target.closest("li.visible");
      if (li) {
        const items = wrap.querySelectorAll("li.visible");
        const index = Array.from(items).indexOf(li);
        const floatWrap = document.querySelector(".float-image-wrap") as HTMLElement;
        const count = document.querySelectorAll(".mouse-pos-list-image .float-image-wrap li.visible").length;
        if (floatWrap && count > 0 && index >= 0) {
          gsap.to(floatWrap, {
            y: `${(index * 100) / (count * -1)}%`,
            duration: 0.6,
            ease: "power2.inOut",
          });
        }
        const bounce = document.querySelector(".mouse-pos-list-image.active .mouse-pos-list-image-bounce");
        if (bounce) {
          bounce.classList.add("active");
          setTimeout(() => bounce.classList.remove("active"), 400);
        }
      }
    };
    const onWorkWrapMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related?.closest(".mouse-pos-list-image-wrap")) {
        cursorImage?.classList.remove("active");
        cursorBtn?.classList.remove("active");
        cursorSpan?.classList.remove("active");
      }
    };
    document.body.addEventListener("mouseover", onWorkWrapMouseOver);
    document.body.addEventListener("mouseout", onWorkWrapMouseOut);

    // Tile hover
    const tileItems = document.querySelectorAll(".single-tile-wrap a, .next-case-btn");
    tileItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        cursorBtn?.classList.add("active-big");
        cursorSpan?.classList.add("active-big");
      });
      item.addEventListener("mouseleave", () => {
        cursorBtn?.classList.remove("active-big");
        cursorSpan?.classList.remove("active-big");
      });
    });

    return () => {
      gsap.ticker.remove(onFrame);
      document.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseover", onWorkWrapMouseOver);
      document.body.removeEventListener("mouseout", onWorkWrapMouseOut);
    };
  }, []);

  const initHorizontalScroll = useCallback(() => {
    if (typeof window === "undefined") return;

    const nameWrap = document.querySelector(".big-name .name-wrap") as HTMLElement;
    if (!nameWrap) return;

    let direction = 1;

    const roll = (targets: string, duration: number, reverse = false) => {
      const elements = gsap.utils.toArray(targets) as HTMLElement[];
      if (elements.length === 0) return null;

      const tl = gsap.timeline({
        repeat: -1,
        onReverseComplete() {
          this.totalTime(this.rawTime() + this.duration() * 10);
        },
      });

      const clones = elements.map((el) => {
        const clone = el.cloneNode(true) as HTMLElement;
        el.parentNode?.appendChild(clone);
        return clone;
      });

      const positionClones = () => {
        elements.forEach((el, i) => {
          gsap.set(clones[i], {
            position: "absolute",
            overwrite: false,
            top: el.offsetTop,
            left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth),
          });
        });
      };

      positionClones();

      elements.forEach((el, i) => {
        tl.to([el, clones[i]], { xPercent: reverse ? 100 : -100, duration, ease: "none" }, 0);
      });

      window.addEventListener("resize", () => {
        const time = tl.totalTime();
        tl.totalTime(0);
        positionClones();
        tl.totalTime(time);
      });

      return tl;
    };

    const roll1 = roll(".big-name .name-wrap", 18);

    if (roll1) {
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate(self) {
          if (self.direction !== direction) {
            direction = self.direction;
            gsap.to(roll1, { timeScale: direction, overwrite: true });
          }
        },
      });
    }
  }, []);

  const initScrollTriggerAnimations = useCallback(() => {
    if (typeof window === "undefined") return;

    // Scrolled class for hamburger visibility (hamburger only shows after user scrolls down)
    const mainEl = document.querySelector("main");
    ScrollTrigger.create({
      trigger: document.body,
      start: "top -30%",
      end: "bottom bottom",
      onEnter: () => mainEl?.classList.add("scrolled"),
      onLeaveBack: () => mainEl?.classList.remove("scrolled"),
    });
    // Ensure hamburger is hidden on load (in case scroll position was restored)
    mainEl?.classList.remove("scrolled");

    // Footer rounded div animation
    const footerFooterWrap = document.querySelector(".footer-footer-wrap");
    if (footerFooterWrap) {
      const roundedDiv = document.querySelector(".footer-rounded-div .rounded-div-wrap");
      const footerArrow = document.querySelector("footer .arrow");
      if (roundedDiv) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footerFooterWrap,
            start: "0% 100%",
            end: "100% 100%",
            scrub: 0,
          },
        });
        tl.to(roundedDiv, { height: 0, ease: "none" }, 0);
        if (footerArrow) {
          tl.from(footerArrow, { rotate: 15, ease: "none" }, 0);
        }
      }
    }

    // Home header arrow rotation
    const homeHeader = document.querySelector(".home-header");
    if (homeHeader) {
      const arrow = homeHeader.querySelector(".arrow");
      if (arrow) {
        gsap.timeline({
          scrollTrigger: {
            trigger: homeHeader,
            start: "100% 100%",
            end: "100% 0%",
            scrub: 0,
          },
        }).to(arrow, { rotate: 90, ease: "none" });
      }
    }

    // Globe rotation
    const globe = document.querySelector(".digital-ball .globe");
    if (globe) {
      gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "0% 0%",
          end: "100% 100%",
          scrub: 0,
        },
      }).to(globe, { rotate: 90, ease: "none" });
    }

    // Span lines animation
    const spanLines = document.querySelectorAll(".span-lines.animate");
    spanLines.forEach((el) => {
      const innerSpans = el.querySelectorAll(".span-line-inner");
      if (innerSpans.length) {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            toggleActions: "play none none reset",
            start: "0% 100%",
            end: "100% 0%",
          },
        }).from(innerSpans, { y: "100%", stagger: 0.01, ease: "power3.out", duration: 1 });
      }
    });

    // Fade in animation
    const fadeIns = document.querySelectorAll(".fade-in.animate");
    fadeIns.forEach((el) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          toggleActions: "play none none reset",
          start: "0% 110%",
          end: "100% 0%",
        },
      }).from(el, { y: "2em", opacity: 0, ease: "expo.out", duration: 1.75 });
    });

    // Footer hamburger shadow
    const footerWrap = document.querySelector(".footer-wrap");
    if (footerWrap) {
      const hamburgerBtn = document.querySelector(".btn-hamburger .btn-click");
      if (hamburgerBtn) {
        gsap.timeline({
          scrollTrigger: {
            trigger: footerWrap,
            start: "50% 100%",
            end: "100% 120%",
            scrub: 0,
          },
        }).from(hamburgerBtn, { boxShadow: "0px 0px 0px 0px rgb(0, 0, 0)", ease: "none" });
      }
    }
  }, []);

  const initSpanLines = useCallback(() => {
    const spanWords = document.querySelectorAll(".span-lines:not([data-processed])");
    spanWords.forEach((el) => {
      el.innerHTML = el.innerHTML.replace(
        /(^|<\/?[^>]+>|\s+)([^\s<]+)/g,
        '$1<span class="span-line"><span class="span-line-inner">$2</span></span>'
      );
      el.setAttribute("data-processed", "true");
    });
  }, []);

  const initTimeZone = useCallback(() => {
    const timeSpan = document.getElementById("timeSpan");
    if (!timeSpan) return;

    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Europe/Amsterdam",
      timeZoneName: "short",
      hour: "2-digit",
      hour12: true,
      minute: "numeric",
    };
    const formatter = new Intl.DateTimeFormat([], options);

    const updateTime = () => {
      timeSpan.textContent = formatter.format(new Date());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const initLazyLoad = useCallback(() => {
    const lazyElements = document.querySelectorAll("[data-bg]");
    lazyElements.forEach((el) => {
      const bg = el.getAttribute("data-bg");
      if (bg) {
        (el as HTMLElement).style.backgroundImage = `url(${bg})`;
      }
    });
  }, []);

  const initVideoPlayPause = useCallback(() => {
    const videos = document.querySelectorAll(".playpauze video");
    videos.forEach((video) => {
      const v = video as HTMLVideoElement;
      ScrollTrigger.create({
        trigger: v,
        start: "0% 120%",
        end: "100% -20%",
        onEnter: () => v.play(),
        onEnterBack: () => v.play(),
        onLeave: () => v.pause(),
        onLeaveBack: () => v.pause(),
      });
    });
  }, []);

  const initHamburgerNav = useCallback(() => {
    const btnMenu = document.querySelectorAll(".btn-menu");
    btnMenu.forEach((btn) => {
      btn.addEventListener("click", () => {
        const hamburger = document.querySelector(".btn-hamburger");
        const main = document.querySelector("main");
        if (hamburger?.classList.contains("active")) {
          hamburger.classList.remove("active");
          btn.classList.remove("active");
          main?.classList.remove("nav-active");
        } else {
          hamburger?.classList.add("active");
          btn.classList.add("active");
          main?.classList.add("nav-active");
        }
      });
    });

    const fixedNavBack = document.querySelector(".fixed-nav-back");
    fixedNavBack?.addEventListener("click", () => {
      document.querySelectorAll(".btn-hamburger, .btn-menu").forEach((el) => {
        el.classList.remove("active");
      });
      document.querySelector("main")?.classList.remove("nav-active");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const main = document.querySelector("main");
        if (main?.classList.contains("nav-active")) {
          document.querySelectorAll(".btn-hamburger, .btn-menu").forEach((el) => {
            el.classList.remove("active");
          });
          main.classList.remove("nav-active");
        }
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Set vh variable
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);

    // Check touch device
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const main = document.querySelector("main");
    main?.classList.toggle("touch", isTouch);
    main?.classList.toggle("no-touch", !isTouch);

    // Remove is-loading class
    document.body.classList.remove("is-loading");

    // Kill existing ScrollTriggers on route change
    ScrollTrigger.getAll().forEach((t) => t.kill());
    initialized.current = false;

    // Hamburger hidden at top: ensure main does not have "scrolled" on load
    document.querySelector("main")?.classList.remove("scrolled");

    // Initialize Lenis smooth scroll
    if (!lenisRef.current) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 2,
      });
      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      lenis.on("scroll", ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          if (arguments.length && typeof value === "number") {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
      });
      ScrollTrigger.defaults({ scroller: document.body });
    }

    // Initialize all after a delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      if (!initialized.current) {
        initSpanLines();
        initLazyLoad();
        initMagneticButtons();
        initHoverImagePreview();
        initHorizontalScroll();
        initScrollTriggerAnimations();
        initTimeZone();
        initVideoPlayPause();
        initHamburgerNav();
        ScrollTrigger.refresh();
        initialized.current = true;
      }
    }, 800);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", setVh);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [
    pathname,
    initSpanLines,
    initLazyLoad,
    initMagneticButtons,
    initHoverImagePreview,
    initHorizontalScroll,
    initScrollTriggerAnimations,
    initTimeZone,
    initVideoPlayPause,
    initHamburgerNav,
  ]);

  return null;
}
