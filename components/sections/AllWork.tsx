"use client";

import { useRef, useState, useCallback, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { projects } from "@/content/projects";
import { Section } from "@/components/ui/Section";
import type { Project } from "@/content/projects";

const visibleProjects = () => projects.filter((p) => !p.hidden);

// ─── Carousel layout constants (tuned so 5 cards visible on large, 3 on small; center card can be centred) ───
const CARD_SLOT_WIDTH = 180;
const CARD_SLOT_HALF = CARD_SLOT_WIDTH / 2; // 90 – used for centering math
const CARD_GAP = 52;
const SLOT_WIDTH = CARD_SLOT_WIDTH + CARD_GAP; // 232 – larger gap so visual spacing is more even (center card scale makes center gaps look smaller)

/** Center card scale; each step away is slightly smaller */
const FOCUS_SCALE = 1.2;
const SCALE_STEP = 0.08;
const MIN_SCALE = 0.92;
/** Opacity falls with distance from center (center=1) */
const OPACITY_STEP = 0.18;
const MIN_OPACITY = 0.5;

/**
 * Strip range: logical indices from -stripLeft to stripRight (1 at 0,
 * infinite feel each way). Sized to a small buffer per side (not the whole
 * illusion's worth of copies) — clones outside the single canonical period
 * are marked `inert` (see isCanonical below), so a much larger buffer would
 * only add unreachable DOM weight, not extra usable scroll range.
 */
const STRIP_BUFFER_PERIODS = 2;

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

/** Pull factor: how much the icon drifts from center toward the mouse (0 = fixed, 1 = full follow) */
const HOVER_ICON_PULL = 0.22;

/** Round view icon that follows the cursor with spring physics — runs entirely on the compositor */
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
  const [isHovered, setIsHovered] = useState(false);

  // Raw cursor offset from image center (px) — set imperatively, no React re-render on mousemove
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring smoothing gives the icon physical weight; interruption-safe
  const springX = useSpring(rawX, { stiffness: 280, damping: 26 });
  const springY = useSpring(rawY, { stiffness: 280, damping: 26 });

  // Pull the displacement toward center — icon drifts 22% of the way to cursor
  const iconX = useTransform(springX, (v) => v * HOVER_ICON_PULL);
  const iconY = useTransform(springY, (v) => v * HOVER_ICON_PULL);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set(e.clientX - rect.left - rect.width / 2);
    rawY.set(e.clientY - rect.top - rect.height / 2);
  }, [rawX, rawY]);

  const handleEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Seed position from entry point so icon doesn't teleport from center
    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      rawX.jump(e.clientX - rect.left - rect.width / 2);
      rawY.jump(e.clientY - rect.top - rect.height / 2);
    }
    setIsHovered(true);
  }, [rawX, rawY]);

  const handleLeave = useCallback(() => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-2xl border border-border-subtle"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition group-hover:scale-[1.02]"
        sizes={sizes}
        quality={95}
      />
      {/* Overlay fades in to ensure icon contrast */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-black"
        animate={{ opacity: isHovered ? 0.4 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        aria-hidden
      />
      {/* Icon: centered anchor + spring-driven offset via transforms (compositor-only) */}
      <motion.span
        className="pointer-events-none absolute flex h-12 w-12 items-center justify-center rounded-full bg-white text-text shadow-md dark:bg-stone-800 dark:text-white"
        style={{
          left: "50%",
          top: "50%",
          translateX: "-50%",
          translateY: "-50%",
          x: iconX,
          y: iconY,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.65,
        }}
        transition={{
          opacity: { duration: 0.18, ease: "easeOut" },
          scale: { type: "spring", stiffness: 420, damping: 28 },
        }}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </motion.span>
    </div>
  );
}

/** Distance from center at which image starts to desaturate (grayscale) */
const GRAYSCALE_DISTANCE = 2;

const AllWorkCard = memo(function AllWorkCard({
  project,
  isFocused,
  distanceFromCenter,
  isCanonical,
}: {
  project: Project;
  isFocused: boolean;
  distanceFromCenter: number;
  isCanonical: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const tags = categoryTags(project.category);
  const showChips = isFocused && tags.length > 0;
  const scale = Math.max(MIN_SCALE, FOCUS_SCALE - distanceFromCenter * SCALE_STEP);
  const baseOpacity = Math.max(MIN_OPACITY, 1 - distanceFromCenter * OPACITY_STEP);
  const opacity = isHovered ? 1 : baseOpacity;
  const grayscale = !isHovered && distanceFromCenter >= GRAYSCALE_DISTANCE;

  return (
    <div
      className="all-work-card group flex shrink-0 flex-col transition-[transform,opacity] duration-300 ease-out"
      style={{
        scrollSnapAlign: "center",
        scrollSnapStop: "always",
        width: CARD_SLOT_WIDTH,
        minWidth: CARD_SLOT_WIDTH,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        opacity,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Every project appears once as a real, focusable/clickable card (the
      // canonical copy); every other physical repetition of the strip — pure
      // visual filler for the infinite-scroll illusion — is inert: excluded
      // from tab order, the AT tree, and pointer interaction.
      inert={!isCanonical}
    >
      <Link
        href={`/work/${project.slug}`}
        prefetch={false}
        aria-label={`View case study: ${project.title}`}
        className="flex flex-col"
      >
        <motion.div
          className="flex h-[240px] w-full shrink-0 overflow-hidden rounded-2xl"
          animate={{ filter: grayscale ? "grayscale(0.85)" : "grayscale(0)" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {project.image && (
            <ImageWithHoverIcon
              src={project.image}
              alt=""
              sizes="(max-width: 767px) 280px, 460px"
            />
          )}
        </motion.div>
        <h3 className="mt-3 shrink-0 text-center text-body font-bold text-text">
          {project.title}
        </h3>
        <AnimatePresence>
          {showChips && tags.length > 0 && (
            <motion.div
              key="chips"
              className="mt-2 flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: "easeOut", delay: 0.1 }}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border-0 bg-border px-3 py-1 text-[10px] font-medium text-text-muted shadow-sm"
                >
                  {tag === "Information Architecture" ? "IA" : tag}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </div>
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
  // Buffer sized to a couple of full periods per side — enough for a smooth
  // infinite feel, nowhere near the ~400-node original.
  const stripLeft = count * STRIP_BUFFER_PERIODS;
  const stripRight = count * STRIP_BUFFER_PERIODS;
  // Exactly one period (one real copy of each project) stays interactive;
  // every other physical repetition is inert (see AllWorkCard).
  const canonicalStart = -Math.floor(count / 2);
  const canonicalEnd = canonicalStart + count - 1;
  /** Logical index of the centered card; 0 = project 1 (latest). No start/end – strip is infinite. */
  const [centerLogicalIndex, setCenterLogicalIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  /** Only update state when the centered card actually changes to avoid flicker during scroll */
  const lastCenterLogicalRef = useRef(0);

  const totalCards = stripLeft + 1 + stripRight;
  /** focusIndex for indicator: 0..6 so "Project (focusIndex+1) of 7" */
  const focusIndex = ((centerLogicalIndex % count) + count) % count;

  const goNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el || count === 0) return;
    const nextLogical = lastCenterLogicalRef.current + 1;
    const domIndex = nextLogical + stripLeft;
    el.scrollTo({
      left: getScrollLeftForCenter(domIndex, el.clientWidth),
      behavior: "smooth",
    });
  }, [count, stripLeft]);

  const goBack = useCallback(() => {
    const el = scrollRef.current;
    if (!el || count === 0) return;
    const prevLogical = lastCenterLogicalRef.current - 1;
    const domIndex = prevLogical + stripLeft;
    el.scrollTo({
      left: getScrollLeftForCenter(domIndex, el.clientWidth),
      behavior: "smooth",
    });
  }, [count, stripLeft]);

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
    el.scrollLeft = getScrollLeftForCenter(stripLeft, el.clientWidth);
  }, [count, stripLeft]);

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
        -stripLeft,
        Math.min(stripRight, domIndex - stripLeft)
      );
      if (logicalIndex !== lastCenterLogicalRef.current) {
        lastCenterLogicalRef.current = logicalIndex;
        setCenterLogicalIndex(logicalIndex);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [count, stripLeft, stripRight]);

  if (list.length === 0) return null;

  return (
    <Section
      id="all-work"
      title="Case Studies"
      headerClassName="text-center"
      titleClassName="text-2xl md:text-3xl font-bold text-text"
      className="py-20 md:py-28"
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
            const logicalIndex = i - stripLeft;
            const project = getProjectAtLogicalIndex(logicalIndex, list, count);
            const isFocused = logicalIndex === centerLogicalIndex;
            const distanceFromCenter = Math.abs(logicalIndex - centerLogicalIndex);
            const isCanonical = logicalIndex >= canonicalStart && logicalIndex <= canonicalEnd;
            return (
              <AllWorkCard
                key={logicalIndex}
                project={project}
                isFocused={isFocused}
                distanceFromCenter={distanceFromCenter}
                isCanonical={isCanonical}
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
          <motion.button
            type="button"
            onClick={goBack}
            aria-controls="all-work-carousel"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-caption font-medium text-text focus:outline-none focus:ring-2 focus:ring-accent/30"
            aria-label="Previous project"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <span aria-hidden>←</span> BACK
          </motion.button>

          <div
            className="flex h-1.5 min-w-[120px] flex-1 max-w-[200px] overflow-hidden rounded-full bg-border-subtle"
            role="progressbar"
            aria-valuenow={focusIndex + 1}
            aria-valuemin={1}
            aria-valuemax={count}
            aria-label={`Project ${focusIndex + 1} of ${count}`}
          >
            <motion.div
              className="h-full rounded-full bg-text-muted"
              animate={{ width: `${((focusIndex + 1) / count) * 100}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
            />
          </div>

          <motion.button
            type="button"
            onClick={goNext}
            aria-controls="all-work-carousel"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-caption font-medium text-text focus:outline-none focus:ring-2 focus:ring-accent/30"
            aria-label="Next project"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            NEXT <span aria-hidden>→</span>
          </motion.button>
        </div>
      </div>
    </Section>
  );
}
