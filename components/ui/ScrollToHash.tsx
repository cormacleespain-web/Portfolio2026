"use client";

import { useEffect } from "react";

/**
 * On load, if the URL has a hash (e.g. /#selected-works), scroll to that
 * element with smooth behavior. Works with Next.js client navigation.
 */
export function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash?.slice(1);
    if (!hash) return;
    const scrollToTarget = () => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const id = window.setTimeout(scrollToTarget, 100);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
