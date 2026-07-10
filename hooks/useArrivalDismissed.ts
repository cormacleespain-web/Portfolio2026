"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const html = document.documentElement;
  const observer = new MutationObserver(callback);
  observer.observe(html, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot(): boolean {
  return document.documentElement.classList.contains("arrival-dismissed");
}

/**
 * Returns `true` once the arrival cover has been dismissed
 * (i.e. `html.arrival-dismissed` is present).
 * If the class is already there on mount (returning visitor), returns `true` immediately.
 */
export function useArrivalDismissed(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
