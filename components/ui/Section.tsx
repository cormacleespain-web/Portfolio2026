import { type ReactNode } from "react";

interface SectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Extra class for the section element */
  className?: string;
}

/**
 * Section wrapper with strong heading and optional subtitle.
 * Clear vertical rhythm for content blocks.
 */
export function Section({
  id,
  title,
  subtitle,
  children,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-12 md:py-16 ${className}`.trim()}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <header className="mb-8">
        <h2
          id={id ? `${id}-heading` : undefined}
          className="text-section font-semibold uppercase tracking-wider text-text-muted"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-body-sm text-text-subtle">{subtitle}</p>
        )}
      </header>
      {children}
    </section>
  );
}
