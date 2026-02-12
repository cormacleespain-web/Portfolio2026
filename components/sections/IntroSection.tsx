"use client";

import { useEffect } from "react";
import { RocketScene } from "@/components/three/RocketScene";

const SCROLL_DELAY_MS = 4500;
const SCROLL_DURATION_MS = 3800;

/** Ease-in-out quintic: very smooth start and end, single continuous motion */
function easeInOutQuint(t: number): number {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function smoothScrollToHero() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const startY = window.scrollY;
  const endY = hero.getBoundingClientRect().top + startY;
  const distance = endY - startY;
  if (Math.abs(distance) < 1) return;

  const prevRestoration = history.scrollRestoration;
  history.scrollRestoration = "manual";

  let rafId: number;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / SCROLL_DURATION_MS, 1);
    const eased = easeInOutQuint(progress);
    const y = startY + distance * eased;
    window.scrollTo({ top: y, left: 0, behavior: "auto" });

    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      history.scrollRestoration = prevRestoration;
    }
  }

  rafId = requestAnimationFrame(step);
}

/**
 * Full-viewport intro: noise sphere + particles over the star background.
 * After 4.5s, one smooth ease-in-out scroll to the Hero section over ~3.8s.
 */
export function IntroSection() {
  useEffect(() => {
    const timeoutId = window.setTimeout(smoothScrollToHero, SCROLL_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <section
      className="relative w-full"
      style={{ height: "100vh", minHeight: "100vh" }}
      aria-hidden
    >
      <RocketScene
        className="absolute inset-0"
        controls={false}
        pointerEvents="none"
        fillParent
        hideBackground
        transparentBackground
      />
    </section>
  );
}
