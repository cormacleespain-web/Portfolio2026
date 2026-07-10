"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { siteData } from "@/content/siteData";

/* ── Icons ──────────────────────────────────────────────────── */

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, { color: string; icon: React.ReactNode }> = {
  LinkedIn: {
    color: "#0A66C2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  Dribbble: {
    color: "#EA4C89",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.167c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
      </svg>
    ),
  },
  Instagram: {
    color: "#E4405F",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.268 4.771 1.691 5.077 4.907.06 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.299 3.225-1.916 4.771-5.077 5.077-1.265.06-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.299-4.771-1.916-5.077-5.077-.06-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.299-3.266 1.916-4.771 5.077-5.077 1.265-.06 1.644-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
};

/* ── Wave path builder ────────────────────────────────────── */

const WAVE_W = 1440;
const WAVE_H = 120;

/**
 * Build an SVG path whose top edge curves downward by `curve` px.
 * curve = 0 -> flat top edge, curve > 0 -> bowl shape, curve < 0 -> inverted (bounce overshoot).
 */
function buildWavePath(curve: number): string {
  return [
    `M0,0`,
    `C0,0 ${WAVE_W / 3},${curve} ${WAVE_W / 2},${curve}`,
    `S${WAVE_W},0 ${WAVE_W},0`,
    `V${WAVE_H} H0 Z`,
  ].join(" ");
}

/* ── Sub-components ────────────────────────────────────────── */

function LocationPill() {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"
      aria-label="Based in Barcelona — currently active"
    >
      <span className="font-mono text-body-sm text-text">Barcelona</span>
      <span className="h-2 w-2 shrink-0 rounded-full bg-[#22c55e]" aria-hidden />
    </div>
  );
}

function formatBarcelonaTime(d: Date) {
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Europe/Madrid",
  });
}

function LiveTime() {
  const [time, setTime] = useState<string>(() =>
    formatBarcelonaTime(new Date()),
  );

  useEffect(() => {
    const id = setInterval(
      () => setTime(formatBarcelonaTime(new Date())),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <p className="text-caption text-text-muted" aria-hidden>
      {time || "\u00A0"}
    </p>
  );
}

/* ── Footer ────────────────────────────────────────────────── */

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { heading, email, links } = siteData.contact;
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [email]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const proxy = { curve: 0 };

        if (pathRef.current) {
          pathRef.current.setAttribute("d", buildWavePath(0));
        }

        ScrollTrigger.create({
          trigger: footerRef.current,
          start: "top bottom",
          onEnter: (self) => {
            const v = gsap.utils.clamp(
              0,
              2,
              Math.abs(self.getVelocity()) / 10000,
            );
            gsap.fromTo(
              proxy,
              { curve: 80 + v * 40 },
              {
                curve: 0,
                duration: 2,
                ease: `elastic.out(${1 + v}, ${Math.max(0.3, 1 - v)})`,
                onUpdate() {
                  pathRef.current?.setAttribute(
                    "d",
                    buildWavePath(proxy.curve),
                  );
                },
                overwrite: true,
              },
            );
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        pathRef.current?.setAttribute("d", buildWavePath(0));
      });
    },
    { scope: footerRef },
  );

  return (
    <footer ref={footerRef} id="site-footer" className="relative">
      {/* Bouncy wave transition — SVG top edge bounces flat with elastic ease */}
      <div
        className="pointer-events-none select-none"
        aria-hidden="true"
        style={{ marginBottom: -1 }}
      >
        <svg
          viewBox={`0 0 ${WAVE_W} ${WAVE_H}`}
          preserveAspectRatio="none"
          className="block h-[80px] w-full md:h-[120px]"
          style={{ overflow: "visible" }}
        >
          <path
            ref={pathRef}
            d={buildWavePath(0)}
            style={{ fill: "var(--color-surface)" }}
          />
        </svg>
      </div>

      {/* Contact content */}
      <div
        className="px-6 pb-16 pt-12 text-center md:pb-20 md:pt-16"
        id="contact"
        style={{ background: "var(--color-surface)" }}
        aria-labelledby="contact-heading"
      >
        <div className="mx-auto max-w-2xl">
          <h2
            id="contact-heading"
            className="text-section font-medium uppercase tracking-[0.2em] text-white/90"
          >
            {heading}
          </h2>

          <p
            className="mt-12 font-display text-4xl font-normal tracking-tight text-white/95 sm:text-5xl md:text-6xl"
            aria-label={`Email: ${email}`}
          >
            {email}
          </p>

          <motion.button
            type="button"
            onClick={copyEmail}
            className="mt-6 inline-flex h-11 min-w-0 overflow-hidden rounded-full border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#1c1917]"
            aria-label={copied ? "Email copied" : "Copy email address"}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="flex flex-1 items-center justify-center bg-black px-5 py-2.5 text-body-sm font-medium text-white/90">
              {copied ? "Copied!" : "Copy Email"}
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-white text-[#1A1A1A]">
              <CopyIcon />
            </span>
          </motion.button>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {links.map((link) => {
              const meta = SOCIAL_ICONS[link.label] ?? {
                color: "#a8a29e",
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                ),
              };
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/40 bg-[#1F1F1F] text-white/90 transition-colors hover:border-white/50 hover:bg-[#252525] hover:text-[var(--hover-color)]"
                  style={
                    {
                      ["--hover-color" as string]: meta.color,
                    } as React.CSSProperties
                  }
                  aria-label={link.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {meta.icon}
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Location & time */}
      <div
        className="flex flex-col items-center gap-2 pb-12"
        style={{ background: "var(--color-surface)" }}
      >
        <LocationPill />
        <LiveTime />
      </div>
    </footer>
  );
}
