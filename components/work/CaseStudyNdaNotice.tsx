import { Lock } from "@phosphor-icons/react/dist/ssr";

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
      <Lock weight="light" className="h-4 w-4 shrink-0 text-text-subtle" aria-hidden />
      {note}
    </p>
  );
}
