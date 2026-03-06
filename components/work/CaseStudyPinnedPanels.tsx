"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import type { CaseStudySection } from "@/content/projects";
import type { TimelinePhase } from "@/components/work/CaseStudyTimeline";

/*
 * Animation ownership:
 * - .pinned-panel  → GSAP: position + transform (ScrollTrigger pin)
 * - No Motion components — this is pure GSAP territory
 */

interface CaseStudyPinnedPanelsProps {
  phases: TimelinePhase[];
  sections: CaseStudySection[];
  className?: string;
}

const aspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
};

function getBg(index: number): string {
  if (index === 0) return "bg-accent-muted";
  return index % 2 === 0 ? "bg-surface" : "bg-background";
}

function TimelineCard({ phases }: { phases: TimelinePhase[] }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <p className="mb-3 text-caption font-semibold uppercase tracking-wider text-text">
        01
      </p>
      <h3 className="text-hero font-bold text-text">Design Process</h3>
      <ul className="mt-8 flex flex-col gap-4" aria-label="Process phases">
        {phases.map((phase, i) => (
          <li key={phase.label} className="flex items-center gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-accent text-caption font-semibold text-accent">
                {i + 1}
              </span>
              <span className="text-body-sm font-medium text-text-muted">
                {phase.short ?? phase.label}
              </span>
            </li>
          ))}
        </ul>
    </div>
  );
}

function SectionCard({
  section,
  panelIndex,
}: {
  section: CaseStudySection;
  panelIndex: number;
}) {
  const captionColor =
    panelIndex === 0 ? "text-text" : "text-accent";

  return (
    <div
      className="mx-auto w-full max-w-3xl overflow-y-auto max-h-[calc(100vh-6rem)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded"
      tabIndex={0}
      role="region"
      aria-label={`${section.heading} content`}
    >
      <p
        className={`mb-3 text-caption font-semibold uppercase tracking-wider ${captionColor}`}
      >
        {String(panelIndex + 1).padStart(2, "0")}
      </p>
      <h3 className="text-hero font-bold text-text">{section.heading}</h3>
      <p className="mt-5 max-w-2xl whitespace-pre-wrap text-body-sm leading-relaxed text-text-muted">
        {section.body}
      </p>

      {section.callout && (
        <blockquote className="my-6 border-l-4 border-accent/50 bg-background/40 px-5 py-4 text-body-sm italic text-text-muted rounded-r-lg">
          {section.callout}
        </blockquote>
      )}

      {section.image && (
        <div
          className={`relative mt-6 w-full overflow-hidden rounded-xl border border-border bg-surface ${aspectClasses[section.imageAspect ?? "video"]}`}
        >
          <Image
            src={section.image}
            alt={section.imageAlt ?? section.heading}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 960px"
          />
        </div>
      )}
    </div>
  );
}

export function CaseStudyPinnedPanels({
  phases,
  sections,
  className = "",
}: CaseStudyPinnedPanelsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [usePinned, setUsePinned] = useState(true);

  const totalPanels = 1 + sections.length;

  const panelLabels = [
    "Design Process",
    ...sections.map((s) => s.heading),
  ];

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 767px)");

    const update = () => setUsePinned(!mqMotion.matches && !mqMobile.matches);
    update();

    mqMotion.addEventListener("change", update);
    mqMobile.addEventListener("change", update);
    return () => {
      mqMotion.removeEventListener("change", update);
      mqMobile.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (liveRegionRef.current && totalPanels > 0 && usePinned) {
      liveRegionRef.current.textContent = `Card 1 of ${totalPanels}: Design Process`;
    }
  }, [totalPanels, usePinned]);

  const updateActiveIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = `Card ${index + 1} of ${totalPanels}: ${panelLabels[index]}`;
      }
    },
    [totalPanels, panelLabels],
  );

  useGSAP(
    () => {
      if (!usePinned || !containerRef.current) return;

      const panelEls = gsap.utils.toArray<HTMLElement>(
        ".pinned-panel",
        containerRef.current,
      );

      panelEls.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          pin: true,
          pinSpacing: false,
          onEnter: () => updateActiveIndex(i),
          onEnterBack: () => updateActiveIndex(i),
        });
      });
    },
    { scope: containerRef, dependencies: [usePinned, updateActiveIndex] },
  );

  // ── Reduced-motion / mobile fallback: static stacked cards ──────────
  if (!usePinned) {
    return (
      <section
        className={`my-16 space-y-0 ${className}`.trim()}
        role="region"
        aria-labelledby="pinned-cards-heading"
        aria-describedby="pinned-cards-desc"
      >
        <h2 id="pinned-cards-heading" className="sr-only">
          Case study details
        </h2>
        <p id="pinned-cards-desc" className="sr-only">
          {totalPanels} cards stacked vertically. Scroll to read each section.
        </p>

        {/* Timeline card */}
        <article
          className={`flex min-h-[60vh] flex-col justify-center ${getBg(0)} px-6 py-16 sm:px-10`}
        >
          <TimelineCard phases={phases} />
        </article>

        {/* Section cards */}
        {sections.map((section, i) => (
          <article
            key={section.heading}
            className={`flex min-h-[60vh] flex-col justify-center ${getBg(i + 1)} px-6 py-16 sm:px-10`}
          >
            <SectionCard section={section} panelIndex={i + 1} />
          </article>
        ))}
      </section>
    );
  }

  // ── Pinned overscroll panels ────────────────────────────────────────
  return (
    <section
      ref={containerRef}
      className={`${className}`.trim()}
      role="region"
      aria-labelledby="pinned-cards-heading"
      aria-describedby="pinned-cards-desc"
      aria-roledescription="Scrollable cards"
    >
      <h2 id="pinned-cards-heading" className="sr-only">
        Case study details
      </h2>
      <p id="pinned-cards-desc" className="sr-only">
        Scroll to move between {totalPanels} cards.
      </p>

      <nav aria-label="Card navigation" className="sr-only">
        <ul>
          {panelLabels.map((label, i) => (
            <li key={i}>
              <a
                href={`#pinned-card-${i}`}
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Go to: {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Card 1: Design Process timeline */}
      <article
        id="pinned-card-0"
        className={`pinned-panel relative flex h-screen flex-col justify-center ${getBg(0)} px-6 sm:px-10`}
        style={{ zIndex: 1 }}
        aria-hidden={activeIndex !== 0}
        aria-current={activeIndex === 0 ? "true" : undefined}
      >
        <TimelineCard phases={phases} />
      </article>

      {/* Cards 2–N: Case study sections */}
      {sections.map((section, i) => {
        const panelIdx = i + 1;
        const isActive = activeIndex === panelIdx;

        return (
          <article
            key={section.heading}
            id={`pinned-card-${panelIdx}`}
            className={`pinned-panel relative flex h-screen flex-col justify-center ${getBg(panelIdx)} px-6 sm:px-10`}
            style={{ zIndex: panelIdx + 1 }}
            aria-hidden={!isActive}
            aria-current={isActive ? "true" : undefined}
          >
            <SectionCard section={section} panelIndex={panelIdx} />
          </article>
        );
      })}

      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </section>
  );
}
