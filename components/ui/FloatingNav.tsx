"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useRef, type ReactElement } from "react";
import { motion, AnimatePresence } from "motion/react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
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

function ChatBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

type NavItem = {
  href: string;
  label: string;
  icon: () => ReactElement;
};

const navItems: NavItem[] = [
  { href: "/#hero", label: "Home", icon: HomeIcon },
  { href: "/#selected-works", label: "Work", icon: BriefcaseIcon },
  { href: "/#experience", label: "About", icon: InfoIcon },
  { href: "/#contact", label: "Contact", icon: EmailIcon },
];

type HoverRect = { left: number; top: number; width: number; height: number } | null;

export function FloatingNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoverGlowRect, setHoverGlowRect] = useState<HoverRect>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

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
  }, [mobileMenuOpen, closeMobileMenu]);

  useGSAP(() => {
    const footer = document.getElementById("site-footer");
    if (!footer || !containerRef.current) return;

    const el = containerRef.current;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: footer,
        start: "top 90%",
        onEnter: () => {
          gsap.to(el, {
            y: 100,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        },
        onLeaveBack: () => {
          gsap.fromTo(
            el,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" },
          );
        },
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      ScrollTrigger.create({
        trigger: footer,
        start: "top 90%",
        onEnter: () => gsap.set(el, { autoAlpha: 0 }),
        onLeaveBack: () => gsap.set(el, { autoAlpha: 1 }),
      });
    });
  });

  const isHome = pathname === "/";

  const linkClassName =
    "rounded-full px-4 py-2 text-body-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-neutral-900 inline-flex items-center justify-center";

  const renderDesktopNavLink = (item: NavItem) => {
    const { href, label } = item;
    const isHash = href.startsWith("/#");
    const samePage = isHome && isHash;
    const content = href === "/#hero" ? <HomeIcon /> : label;
    const ariaLabel = href === "/#hero" ? "Home" : undefined;

    if (samePage) {
      return (
        <a key={href} href={href} className={linkClassName} aria-label={label}>
          {content}
        </a>
      );
    }
    return (
      <Link key={href} href={href} prefetch={false} className={linkClassName} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-x-0 bottom-0 z-[100] flex justify-center items-center gap-3 pb-6 pointer-events-none"
    >
      {/* ── Mobile FAB menu ── */}
      <div ref={mobileMenuRef} className="md:hidden pointer-events-auto fixed right-5 bottom-6 flex flex-col items-end">
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu-items"
              className="mb-3 flex flex-col items-end gap-2.5"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                closed: { transition: { staggerChildren: 0.03, staggerDirection: 1 } },
              }}
            >
              {/* AI Chat button — distinct orange to stand out */}
              <motion.div
                key="ai-chat"
                className="pointer-events-auto"
                variants={{
                  open: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
                  closed: { opacity: 0, scale: 0.5, y: 16, filter: "blur(4px)" },
                }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
              >
                <button
                  type="button"
                  aria-label="AI Chat"
                  onClick={() => {
                    closeMobileMenu();
                    window.dispatchEvent(new Event("toggle-chat"));
                  }}
                  className="flex items-center gap-2.5"
                >
                  <span className="rounded-full border border-accent-2/20 bg-neutral-950/95 px-3.5 py-2 text-[13px] font-medium text-accent-2 shadow-lg backdrop-blur-md">
                    AI Chat
                  </span>
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent-2/20 bg-accent-2 shadow-lg backdrop-blur-md text-white"
                  >
                    <ChatBubbleIcon />
                  </span>
                </button>
              </motion.div>

              {navItems.map((item) => {
                const { href, label } = item;
                const isHash = href.startsWith("/#");
                const samePage = isHome && isHash;
                const Icon = item.icon;

                const itemContent = (
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full border border-white/5 bg-neutral-950/95 px-3.5 py-2 text-[13px] font-medium text-white/90 shadow-lg backdrop-blur-md">
                      {label}
                    </span>
                    <span className="floating-nav-glow">
                      <span className="floating-nav-glow-inner" aria-hidden />
                      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/5 bg-neutral-950/95 text-white/90 shadow-lg backdrop-blur-md">
                        <Icon />
                      </span>
                    </span>
                  </div>
                );

                const linkEl = samePage ? (
                  <a href={href} aria-label={label} onClick={closeMobileMenu} className="block">
                    {itemContent}
                  </a>
                ) : (
                  <Link href={href} prefetch={false} aria-label={label} onClick={closeMobileMenu} className="block">
                    {itemContent}
                  </Link>
                );

                return (
                  <motion.div
                    key={href}
                    className="pointer-events-auto"
                    variants={{
                      open: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
                      closed: { opacity: 0, scale: 0.5, y: 16, filter: "blur(4px)" },
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  >
                    {linkEl}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB trigger */}
        <div className="floating-nav-glow">
          <div className="floating-nav-glow-inner" aria-hidden />
          <motion.button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen((prev) => !prev);
            }}
            className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/5 bg-neutral-950/95 text-white/90 shadow-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-neutral-950"
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <motion.span
              className="flex items-center justify-center"
              animate={{ rotate: mobileMenuOpen ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <PlusIcon />
            </motion.span>
          </motion.button>
        </div>
      </div>

      {/* ── Desktop nav pill ── */}
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
          <div className="relative z-[1] flex h-14 items-center gap-1 rounded-full border border-white/10 bg-neutral-950/95 px-4 py-2.5 shadow-lg backdrop-blur-md">
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
                {renderDesktopNavLink(item)}
              </span>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
