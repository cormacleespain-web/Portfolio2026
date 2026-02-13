"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

/** 4-pointed star / sparkle icon */
function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M12 0 L14 8 L22 12 L14 16 L12 24 L10 16 L2 12 L10 8 Z" />
    </svg>
  );
}

function LightBulbIcon({ on }: { on: boolean }) {
  if (on) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
      </svg>
    );
  }
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

const navItems = [
  { href: "/#hero", label: "Home", icon: true as const },
  { href: "/#selected-works", label: "Work" },
  { href: "/#experience", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;

export function FloatingNav() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(getInitialDark());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(dark);
  }, [dark, mounted]);

  const handleThemeToggle = () => {
    setDark((prev) => {
      const next = !prev;
      applyTheme(next);
      return next;
    });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isHome = pathname === "/";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] flex justify-center items-center gap-3 pb-6 pointer-events-none"
      aria-hidden
    >
      {/* Floating circle with star button (same height & glow as nav) */}
      <div className="floating-nav-glow pointer-events-auto flex-shrink-0">
        <div className="floating-nav-glow-inner" aria-hidden />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-neutral-900/95 shadow-lg backdrop-blur-md dark:bg-neutral-950/95 dark:border-white/5">
          <button
            type="button"
            aria-label="Scroll to top"
            onClick={handleScrollToTop}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            <StarIcon />
          </button>
        </div>
      </div>

      <nav
        className="floating-nav-glow pointer-events-auto"
        aria-label="Main navigation"
      >
        {/* Soft glow behind the whole menu */}
        <div className="floating-nav-glow-inner" aria-hidden />

        <div className="relative flex h-14 items-center gap-1 rounded-full border border-white/10 bg-neutral-900/95 px-4 py-2.5 shadow-lg backdrop-blur-md dark:bg-neutral-950/95 dark:border-white/5">
        {navItems.map((item) => {
          const { href, label } = item;
          const icon = "icon" in item && item.icon;
          const isHash = href.startsWith("/#");
          const samePage = isHome && isHash;
          const className =
            "rounded-full px-4 py-2 text-body-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-neutral-900 inline-flex items-center justify-center";
          const content = icon ? <HomeIcon /> : label;

          if (samePage) {
            return (
              <a key={href} href={href} className={className} aria-label={label}>
                {content}
              </a>
            );
          }
          return (
            <Link key={href} href={href} prefetch={false} className={className} aria-label={icon ? label : undefined}>
              {content}
            </Link>
          );
        })}

        <button
          type="button"
          role="switch"
          aria-label={dark ? "Dark mode on. Switch to light mode." : "Light mode on. Switch to dark mode."}
          aria-checked={dark}
          onClick={handleThemeToggle}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              handleThemeToggle();
            }
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          <LightBulbIcon on={dark} />
        </button>
      </div>
    </nav>
    </div>
  );
}
