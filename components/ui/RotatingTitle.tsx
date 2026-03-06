"use client";

import { useEffect } from "react";

const TITLES = ["Howdy 👋", "I'm Cormac Lee"];
const INTERVAL_MS = 2500;

export function RotatingTitle() {
  useEffect(() => {
    let index = 0;
    document.title = TITLES[index];

    const id = setInterval(() => {
      index = (index + 1) % TITLES.length;
      document.title = TITLES[index];
    }, INTERVAL_MS);

    return () => {
      clearInterval(id);
    };
  }, []);

  return null;
}
