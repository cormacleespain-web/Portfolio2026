"use client";

import { useEffect } from "react";

/**
 * On load, if the URL has a hash (e.g. /#selected-works), scroll to that
 * element with smooth behavior and move focus to it for keyboard/screen reader users.
 * Works with Next.js client navigation.
 */
export function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash?.slice(1);
    if (!hash) return;
    const scrollToTarget = () => {
      const el = document.getElementById(hash);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Move focus to target so keyboard/screen reader users know where they landed
      const focusable = el.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const target = focusable ?? el;
      if (target === el && !el.hasAttribute("tabindex")) {
        el.setAttribute("tabindex", "-1");
      }
      requestAnimationFrame(() => {
        target.focus({ preventScroll: true });
      });
    };
    const id = window.setTimeout(scrollToTarget, 100);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
