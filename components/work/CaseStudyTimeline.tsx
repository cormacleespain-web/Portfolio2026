"use client";

export interface TimelinePhase {
  label: string;
  short?: string;
}

interface CaseStudyTimelineProps {
  phases: TimelinePhase[];
  className?: string;
}

/**
 * Vertical process timeline for Senior Product Design case studies.
 * Connects phases with a line and highlights the current step visually.
 */
export function CaseStudyTimeline({ phases, className = "" }: CaseStudyTimelineProps) {
  return (
    <div className={`relative ${className}`.trim()} role="list" aria-label="Process timeline">
      {/* Vertical line */}
      <div
        className="absolute left-[11px] top-2 bottom-2 w-px bg-border"
        aria-hidden
      />
      <ul className="relative flex flex-col gap-0">
        {phases.map((phase, i) => (
          <li
            key={phase.label}
            className="relative flex items-start gap-4 pb-8 last:pb-0"
            role="listitem"
          >
            {/* Dot */}
            <span
              className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-background text-caption font-semibold text-accent"
              aria-hidden
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1 pt-0">
              <span className="text-body-sm font-medium text-text">
                {phase.short ?? phase.label}
              </span>
              {phase.short && phase.short !== phase.label && (
                <p className="mt-0.5 text-caption text-text-muted">{phase.label}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
