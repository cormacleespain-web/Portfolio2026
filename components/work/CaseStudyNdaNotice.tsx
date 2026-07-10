interface CaseStudyNdaNoticeProps {
  /** Defaults to the standard note; pass a project-specific one if needed. */
  note?: string;
  className?: string;
}

const DEFAULT_NOTE =
  "Details generalized to respect confidentiality; visuals are recreations.";

export function CaseStudyNdaNotice({ note = DEFAULT_NOTE, className = "" }: CaseStudyNdaNoticeProps) {
  return (
    <p
      className={`mb-8 inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-body-sm text-text-muted ${className}`.trim()}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-text-subtle"
        aria-hidden
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      {note}
    </p>
  );
}
