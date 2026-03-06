"use client";

import { useState, useEffect } from "react";

/**
 * Returns `true` once the arrival cover has been dismissed
 * (i.e. `html.arrival-dismissed` is present).
 * If the class is already there on mount (returning visitor), returns `true` immediately.
 */
export function useArrivalDismissed(): boolean {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("arrival-dismissed")) {
      setDismissed(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (html.classList.contains("arrival-dismissed")) {
        setDismissed(true);
        observer.disconnect();
      }
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dismissed;
}
