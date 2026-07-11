"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export interface TimelinePhase {
  label: string;
  short?: string;
}

interface CaseStudyTimelineProps {
  phases: TimelinePhase[];
  className?: string;
}

export function CaseStudyTimeline({
  phases,
  className = "",
}: CaseStudyTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={containerRef}
      className={`my-16 ${className}`.trim()}
      aria-labelledby="timeline-heading"
    >
      <h2
        id="timeline-heading"
        className="mb-8 text-xl md:text-2xl font-display font-bold text-text"
      >
        Design Process
      </h2>

      <div className="relative">
        {/* Animated vertical line */}
        <motion.div
          className="absolute left-[11px] top-2 bottom-2 w-px origin-top bg-accent/30"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : undefined}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          aria-hidden
        />

        <ul className="relative flex flex-col gap-0" aria-label="Process timeline">
          {phases.map((phase, i) => (
            <motion.li
              key={phase.label}
              className="relative flex items-start gap-4 pb-8 last:pb-0"
              role="listitem"
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3 + i * 0.1,
              }}
            >
              {/* Numbered dot */}
              <motion.span
                className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-background text-caption font-semibold text-accent"
                aria-hidden
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : undefined}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  delay: 0.35 + i * 0.1,
                }}
              >
                {i + 1}
              </motion.span>

              <div className="min-w-0 flex-1 pt-0">
                <span className="text-body-sm font-medium text-text">
                  {phase.short ?? phase.label}
                </span>
                {phase.short && phase.short !== phase.label && (
                  <p className="mt-0.5 text-caption text-text-muted">
                    {phase.label}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
