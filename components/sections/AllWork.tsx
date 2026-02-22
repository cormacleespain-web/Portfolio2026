"use client";

import { useRef, useState, useCallback, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { Section } from "@/components/ui/Section";
import type { Project } from "@/content/projects";

const visibleProjects = () => projects.filter((p) => !p.hidden);

// ─── Carousel layout constants (tuned so 5 cards visible on large, 3 on small; center card can be centred) ───
const CARD_SLOT_WIDTH = 180;
const CARD_SLOT_HALF = CARD_SLOT_WIDTH / 2; // 90 – used for centering math
const CARD_GAP = 52;
const SLOT_WIDTH = CARD_SLOT_WIDTH + CARD_GAP; // 232 – larger gap so visual spacing is more even (center card scale makes center gaps look smaller)

const CAROUSEL_BREAKPOINT = 768;
/** Viewport width = exactly 5 card slots so only 5 cards visible */
const CAROUSEL_VIEWPORT_WIDTH_LG = 5 * SLOT_WIDTH; // 1160
/** Small screens: 3 cards visible */
const CAROUSEL_VIEWPORT_WIDTH_SM = 3 * SLOT_WIDTH; // 696
/** Max viewport width (cap on ultra-wide so padding doesn’t get huge) */
/** Center card scale; each step away is slightly smaller */
const FOCUS_SCALE = 1.2;
const SCALE_STEP = 0.08;
const MIN_SCALE = 0.92;
/** Opacity falls with distance from center (center=1) */
const OPACITY_STEP = 0.18;
const MIN_OPACITY = 0.5;

/** Strip range: logical indices from -STRIP_LEFT to STRIP_RIGHT (1 at 0, infinite feel each way) */
const STRIP_LEFT = 200;
const STRIP_RIGHT = 200;

/** Project at logical index: right of 0 is 1,2,3,4,5,6,7,1,2...; left of 0 is 7,6,5,4,3,2,1,7,6... */
function getProjectAtLogicalIndex(
  logicalIndex: number,
  list: Project[],
  count: number
): Project {
  if (count === 0) return list[0];
  const listIndex =
    logicalIndex >= 0
      ? logicalIndex % count
      : (count + (logicalIndex % count)) % count;
  return list[listIndex];
}

/** Derive short tags from category; use 2–3 for card pills */
function categoryTags(category: string, max = 3): string[] {
  return category
    .split(/\s*·\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

/** Pull factor: how much the icon moves from center toward the mouse (0 = fixed at center, 1 = follows mouse) */
const HOVER_ICON_PULL = 0.22;

/** Round view icon anchored to image center; on hover it pulls slightly toward the mouse and snaps back to center on leave */
function ImageWithHoverIcon({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [point, setPoint] = useState({ x: 50, y: 50 });

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      // Anchor at center (50,50); offset toward mouse by HOVER_ICON_PULL
      const x = 50 + (mx - 50) * HOVER_ICON_PULL;
      const y = 50 + (my - 50) * HOVER_ICON_PULL;
      setPoint({ x, y });
    },
    []
  );

  const handleLeave = useCallback(() => {
    setHover(false);
    setPoint({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-2xl border border-border-subtle"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition group-hover:scale-[1.02]"
        sizes={sizes}
        quality={92}
      />
      {/* Darker overlay on hover so the icon is visible */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-2xl transition-colors duration-200 ${hover ? "bg-black/40" : "bg-transparent"}`}
        aria-hidden
      />
      {/* Round icon anchored to center, pulls toward mouse on hover; snaps back on leave */}
      <span
        className="pointer-events-none absolute left-0 top-0 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-text shadow-md dark:bg-stone-800 dark:text-white"
        style={{
          left: `${point.x}%`,
          top: `${point.y}%`,
          opacity: hover ? 1 : 0,
          transition: hover
            ? "opacity 0.2s ease, left 0.15s ease-out, top 0.15s ease-out"
            : "opacity 0.15s ease, left 0.2s ease-out, top 0.2s ease-out",
        }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
    </div>
  );
}

/** Distance from center at which image starts to desaturate (grayscale) */
const GRAYSCALE_DISTANCE = 2;

const AllWorkCard = memo(function AllWorkCard({
  project,
  isFocused,
  distanceFromCenter,
}: {
  project: Project;
  isFocused: boolean;
  distanceFromCenter: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const tags = categoryTags(project.category);
  const showChips = isFocused && tags.length > 0;
  const scale = Math.max(MIN_SCALE, FOCUS_SCALE - distanceFromCenter * SCALE_STEP);
  const baseOpacity = Math.max(MIN_OPACITY, 1 - distanceFromCenter * OPACITY_STEP);
  const opacity = isHovered ? 1 : baseOpacity;
  const grayscale = !isHovered && distanceFromCenter >= GRAYSCALE_DISTANCE;

  return (
    <Link
      href={`/work/${project.slug}`}
      prefetch={false}
      aria-label={`View case study: ${project.title}`}
      className="all-work-card group flex shrink-0 flex-col transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        scrollSnapAlign: "center",
        scrollSnapStop: "always",
        width: CARD_SLOT_WIDTH,
        minWidth: CARD_SLOT_WIDTH,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        opacity,
      }}
    >
      {/* Fixed-height image area: only this region triggers hover (overlay, icon) */}
      <div
        className="flex h-[240px] w-full shrink-0 overflow-hidden rounded-2xl transition-[filter] duration-300"
        style={grayscale ? { filter: "grayscale(0.85)" } : undefined}
      >
        {project.image && (
          <ImageWithHoverIcon
            src={project.image}
            alt=""
            sizes={`${CARD_SLOT_WIDTH}px`}
          />
        )}
      </div>
      <h3 className="mt-3 shrink-0 text-center text-body font-bold text-text">
        {project.title}
      </h3>
      {tags.length > 0 && (
        <div
          className="mt-2 flex flex-wrap justify-center gap-2 transition-opacity duration-300 ease-out"
          style={{
            opacity: showChips ? 1 : 0,
            transitionDelay: showChips ? "150ms" : "0ms",
          }}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border-0 bg-border px-3 py-1 text-[10px] font-medium text-text-muted shadow-sm"
            >
              {tag === "Information Architecture" ? "IA" : tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
});

/** Padding so the focused card can be centred (symmetric; viewport width already constrains to 5 or 3 cards). */
function getCarouselPadding(containerWidth: number): number {
  return Math.max(0, containerWidth / 2 - CARD_SLOT_HALF);
}

/** Scroll position so that the card at domIndex is centered in the viewport */
function getScrollLeftForCenter(domIndex: number, containerWidth: number) {
  const padding = getCarouselPadding(containerWidth);
  return (
    padding +
    domIndex * SLOT_WIDTH +
    CARD_SLOT_HALF -
    containerWidth / 2
  );
}

export function AllWork() {
  const list = visibleProjects();
  const count = list.length;
  /** Logical index of the centered card; 0 = project 1 (latest). No start/end – strip is infinite. */
  const [centerLogicalIndex, setCenterLogicalIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  /** Only update state when the centered card actually changes to avoid flicker during scroll */
  const lastCenterLogicalRef = useRef(0);

  const totalCards = STRIP_LEFT + 1 + STRIP_RIGHT;
  /** focusIndex for indicator: 0..6 so "Project (focusIndex+1) of 7" */
  const focusIndex = ((centerLogicalIndex % count) + count) % count;

  const goNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el || count === 0) return;
    const nextLogical = centerLogicalIndex + 1;
    setCenterLogicalIndex(nextLogical);
    const domIndex = nextLogical + STRIP_LEFT;
    el.scrollTo({
      left: getScrollLeftForCenter(domIndex, el.clientWidth),
      behavior: "smooth",
    });
  }, [count, centerLogicalIndex]);

  const goBack = useCallback(() => {
    const el = scrollRef.current;
    if (!el || count === 0) return;
    const prevLogical = centerLogicalIndex - 1;
    setCenterLogicalIndex(prevLogical);
    const domIndex = prevLogical + STRIP_LEFT;
    el.scrollTo({
      left: getScrollLeftForCenter(domIndex, el.clientWidth),
      behavior: "smooth",
    });
  }, [count, centerLogicalIndex]);

  const handleCarouselKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goBack();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    },
    [goBack, goNext]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || count === 0) return;
    el.scrollLeft = getScrollLeftForCenter(STRIP_LEFT, el.clientWidth);
  }, [count]);

  useEffect(() => {
    lastCenterLogicalRef.current = centerLogicalIndex;
  }, [centerLogicalIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || count === 0) return;
    const onScroll = () => {
      const w = el.clientWidth;
      const padding = getCarouselPadding(w);
      const viewportCenter = el.scrollLeft + w / 2;
      const rawIndex =
        (viewportCenter - padding - CARD_SLOT_HALF) / SLOT_WIDTH;
      const domIndex = Math.round(rawIndex);
      const logicalIndex = Math.max(
        -STRIP_LEFT,
        Math.min(STRIP_RIGHT, domIndex - STRIP_LEFT)
      );
      if (logicalIndex !== lastCenterLogicalRef.current) {
        lastCenterLogicalRef.current = logicalIndex;
        setCenterLogicalIndex(logicalIndex);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [count]);

  if (list.length === 0) return null;

  return (
    <Section
      id="all-work"
      title="Case Studies"
      headerClassName="text-center"
      titleClassName="text-2xl md:text-3xl font-bold text-text"
      className="py-12 md:py-16"
    >
      <div className="relative">
        {/* Edge-to-edge strip: break out of page padding so viewport can sit in full-width area */}
        <div className="relative -mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)]">
          {/* Viewport: 5 cards on large, 3 on small (see .all-work-viewport in globals.css) */}
          <div className="all-work-viewport mx-auto overflow-hidden">
            <div
              ref={scrollRef}
              id="all-work-carousel"
              tabIndex={0}
              className="all-work-carousel flex gap-[52px] overflow-x-auto overflow-y-hidden pb-0 pt-12 scroll-smooth scrollbar-hide focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-background"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
            role="region"
            aria-label="All work carousel"
            aria-roledescription="carousel"
            onKeyDown={handleCarouselKeyDown}
          >
          {Array.from({ length: totalCards }, (_, i) => {
            const logicalIndex = i - STRIP_LEFT;
            const project = getProjectAtLogicalIndex(logicalIndex, list, count);
            const isFocused = logicalIndex === centerLogicalIndex;
            const distanceFromCenter = Math.abs(logicalIndex - centerLogicalIndex);
            return (
              <AllWorkCard
                key={logicalIndex}
                project={project}
                isFocused={isFocused}
                distanceFromCenter={distanceFromCenter}
              />
            );
          })}
            </div>
          </div>
        </div>

        {/* Live announcement for screen readers when position changes */}
        <p
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          Project {focusIndex + 1} of {count}
        </p>

        {/* Navigation: BACK, progress, NEXT (always enabled for endless loop) */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={goBack}
            aria-controls="all-work-carousel"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-caption font-medium text-text transition hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent/30"
            aria-label="Previous project"
          >
            <span aria-hidden>←</span> BACK
          </button>

          <div
            className="flex h-1.5 min-w-[120px] flex-1 max-w-[200px] overflow-hidden rounded-full bg-border-subtle"
            role="progressbar"
            aria-valuenow={focusIndex + 1}
            aria-valuemin={1}
            aria-valuemax={count}
            aria-label={`Project ${focusIndex + 1} of ${count}`}
          >
            <div
              className="h-full rounded-full bg-text-muted transition-all duration-300"
              style={{ width: `${((focusIndex + 1) / count) * 100}%` }}
            />
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-controls="all-work-carousel"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-caption font-medium text-text transition hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent/30"
            aria-label="Next project"
          >
            NEXT <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </Section>
  );
}
