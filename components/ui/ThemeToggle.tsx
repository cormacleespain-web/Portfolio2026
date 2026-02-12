"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function getInitialDark(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light") return false;
  return true;
}

function applyTheme(dark: boolean) {
  const root = document.documentElement;
  if (dark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
}

export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setDark(getInitialDark());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(dark);
  }, [dark, mounted]);

  const handleToggle = () => {
    setDark((prev) => {
      const next = !prev;
      applyTheme(next);
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top-corner glow on hover: warm white in light mode, accent gradient in dark */}
      <div
        aria-hidden
        className={`theme-toggle-glow pointer-events-none ${hovered ? "theme-toggle-glow-visible" : ""}`}
      />
      <button
        type="button"
        role="switch"
        aria-label={dark ? "Dark mode on. Switch to light mode." : "Light mode on. Switch to dark mode."}
        aria-checked={dark}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-hover hover:text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      >
        {dark ? <LightBulbOnIcon /> : <LightBulbOffIcon />}
      </button>
    </div>
  );
}

function LightBulbOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
    </svg>
  );
}

function LightBulbOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z" />
      <path d="M12 3C8.14 3 5 6.14 5 10c0 2.38 1.19 4.47 3 5.74V17h8v-1.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
    </svg>
  );
}
