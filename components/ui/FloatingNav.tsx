"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, type ReactElement } from "react";

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

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

type NavItem = {
  href: string;
  label: string;
  icon?: boolean;
  mobileIcon?: (() => ReactElement) | null;
};

const navItems: NavItem[] = [
  { href: "/#hero", label: "Home", icon: true, mobileIcon: null },
  { href: "/#selected-works", label: "Work", mobileIcon: BriefcaseIcon },
  { href: "/#experience", label: "About", mobileIcon: InfoIcon },
  { href: "/#contact", label: "Contact", mobileIcon: EmailIcon },
];

type HoverRect = { left: number; top: number; width: number; height: number } | null;

export function FloatingNav() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const [hoverGlowRect, setHoverGlowRect] = useState<HoverRect>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMobileMenu = () => {
    if (mobileMenuClosing) return;
    setMobileMenuClosing(true);
  };

  useEffect(() => {
    if (!mobileMenuClosing) return;
    const duration = 280 + (navItems.length - 1) * 45;
    closeTimeoutRef.current = setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
      closeTimeoutRef.current = null;
    }, duration);
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [mobileMenuClosing]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        closeMobileMenu();
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [mobileMenuOpen]);

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

  const isHome = pathname === "/";

  const linkClassName =
    "rounded-full px-4 py-2 text-body-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-neutral-900 inline-flex items-center justify-center";
  const iconButtonClassName =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-neutral-900";

  const renderNavLink = (item: NavItem, mobile = false) => {
    const { href, label } = item;
    const isHash = href.startsWith("/#");
    const samePage = isHome && isHash;
    const content = mobile
      ? (item.mobileIcon ? <item.mobileIcon /> : item.icon ? <HomeIcon /> : label)
      : (item.icon ? <HomeIcon /> : label);
    const className = mobile ? "p-2.5 min-w-[2.25rem] " + linkClassName : linkClassName;
    const ariaLabel = mobile || item.icon ? label : undefined;

    if (samePage) {
      return (
        <a key={href} href={href} className={className} aria-label={label}>
          {content}
        </a>
      );
    }
    return (
      <Link key={href} href={href} prefetch={false} className={className} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] flex justify-center items-center gap-3 pb-6 pointer-events-none"
    >
      {/* Mobile / tablet: floating hamburger; when open, theme (icon only) to the left and stacked options above (Home, Work, About, Contact) with glow */}
      <div ref={mobileMenuRef} className="md:hidden pointer-events-auto fixed right-4 bottom-6 flex flex-col items-end gap-3">
        {mobileMenuOpen && (
          <div className="flex flex-col items-end gap-3">
            {navItems.map((item, index) => {
              const { href, label } = item;
              const isHash = href.startsWith("/#");
              const samePage = isHome && isHash;
              const Icon = item.mobileIcon ?? (item.icon ? HomeIcon : null) ?? HomeIcon;
              const content = (
                <>
                  {Icon && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                      <Icon />
                    </span>
                  )}
                  <span>{label}</span>
                </>
              );
              const optionClassName =
                "relative flex h-14 items-center gap-2.5 rounded-full border border-white/10 bg-neutral-900/95 pl-3 pr-4 py-2.5 shadow-lg backdrop-blur-md dark:bg-neutral-950/95 dark:border-white/5 text-body-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-neutral-900";
              const optionEl =
                samePage ? (
                  <a
                    href={href}
                    className={optionClassName}
                    aria-label={label}
                    onClick={closeMobileMenu}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={href}
                    prefetch={false}
                    className={optionClassName}
                    aria-label={label}
                    onClick={closeMobileMenu}
                  >
                    {content}
                  </Link>
                );
              const isClosing = mobileMenuClosing;
              const optionAnimationClass = isClosing ? "mobile-nav-option-out" : "mobile-nav-option-in";
              const optionAnimationDelay = isClosing ? index * 45 : (navItems.length - 1 - index) * 45;
              return (
                <div
                  key={href}
                  className={`floating-nav-glow pointer-events-auto ${optionAnimationClass}`}
                  style={{ animationDelay: `${optionAnimationDelay}ms` }}
                >
                  <div className="floating-nav-glow-inner" aria-hidden />
                  {optionEl}
                </div>
              );
            })}
          </div>
        )}
        <div className="flex items-center gap-3">
          {mobileMenuOpen && (
            <div className="floating-nav-glow pointer-events-auto flex-shrink-0">
              <div className="floating-nav-glow-inner" aria-hidden />
              <button
                type="button"
                role="switch"
                aria-label={dark ? "Dark mode on. Switch to light mode." : "Light mode on. Switch to dark mode."}
                aria-checked={dark}
                onClick={() => handleThemeToggle()}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    handleThemeToggle();
                  }
                }}
                className="relative flex h-14 w-14 items-center justify-center rounded-full border border-neutral-300/80 bg-white/95 text-neutral-800 shadow-lg backdrop-blur-md transition hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400/50 focus:ring-offset-2 focus:ring-offset-white dark:border-white/10 dark:bg-neutral-950/95 dark:text-white/90 dark:hover:bg-white/20 dark:hover:text-white dark:focus:ring-white/30 dark:focus:ring-offset-neutral-900"
              >
                <LightBulbIcon on={dark} />
              </button>
            </div>
          )}
          <div className="floating-nav-glow pointer-events-auto flex-shrink-0">
            <div className="floating-nav-glow-inner" aria-hidden />
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={(e) => {
                e.stopPropagation();
                if (mobileMenuClosing) {
                  if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                  setMobileMenuClosing(false);
                } else if (mobileMenuOpen) {
                  closeMobileMenu();
                } else {
                  setMobileMenuOpen(true);
                }
              }}
              className="relative flex h-14 w-14 items-center justify-center rounded-full border border-neutral-300/80 bg-white/95 text-neutral-800 shadow-lg backdrop-blur-md transition hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400/50 focus:ring-offset-2 focus:ring-offset-white dark:border-white/10 dark:bg-neutral-950/95 dark:text-white/90 dark:hover:bg-white/20 dark:hover:text-white dark:focus:ring-white/30 dark:focus:ring-offset-neutral-900"
            >
              <span className="relative h-5 w-5">
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out ${
                    mobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                  }`}
                  aria-hidden
                >
                  <HamburgerIcon />
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out ${
                    mobileMenuOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-75"
                  }`}
                  aria-hidden
                >
                  <CloseIcon />
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: nav pill — hover glow is a sibling behind the pill so it never covers the menu */}
      <div className="hidden md:flex justify-center items-center gap-3">
        <nav
          ref={desktopNavRef}
          className="floating-nav-glow pointer-events-auto"
          aria-label="Main navigation"
          onMouseLeave={(e) => {
            if (!desktopNavRef.current?.contains(e.relatedTarget as Node)) setHoverGlowRect(null);
          }}
        >
          <div className="floating-nav-glow-inner" aria-hidden />
          <div
            className={`floating-nav-hover-glow${hoverGlowRect ? " floating-nav-hover-glow-visible" : ""}`}
            aria-hidden
            style={
              hoverGlowRect
                ? {
                    left: hoverGlowRect.left,
                    top: hoverGlowRect.top,
                    width: hoverGlowRect.width,
                    height: hoverGlowRect.height,
                    opacity: 0.65,
                  }
                : { opacity: 0, width: 0, height: 0, left: 0, top: 0 }
            }
          />
          <div className="relative z-[1] flex h-14 items-center gap-1 rounded-full border border-white/10 bg-neutral-900/95 px-4 py-2.5 shadow-lg backdrop-blur-md dark:bg-neutral-950/95 dark:border-white/5">
            {navItems.map((item) => (
              <span
                key={item.href}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  const nav = desktopNavRef.current;
                  if (!nav) return;
                  const nr = nav.getBoundingClientRect();
                  const er = el.getBoundingClientRect();
                  const pad = 14;
                  setHoverGlowRect({
                    left: er.left - nr.left - pad,
                    top: er.top - nr.top - pad,
                    width: er.width + pad * 2,
                    height: er.height + pad * 2,
                  });
                }}
              >
                {renderNavLink(item, false)}
              </span>
            ))}
            <span
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                const nav = desktopNavRef.current;
                if (!nav) return;
                const nr = nav.getBoundingClientRect();
                const er = el.getBoundingClientRect();
                const pad = 14;
                setHoverGlowRect({
                  left: er.left - nr.left - pad,
                  top: er.top - nr.top - pad,
                  width: er.width + pad * 2,
                  height: er.height + pad * 2,
                });
              }}
            >
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
                className={iconButtonClassName}
              >
                <LightBulbIcon on={dark} />
              </button>
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
}
