import { type ReactNode } from "react";

interface SectionProps {
  id?: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  /** Extra class for the section element */
  className?: string;
  /** Extra class for the header wrapper */
  headerClassName?: string;
  /** Extra class for the title (h2) */
  titleClassName?: string;
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
  headerClassName = "",
  titleClassName = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-24 md:py-32 ${className}`.trim()}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <header className={`mb-10 ${headerClassName}`.trim()}>
        <h2
          id={id ? `${id}-heading` : undefined}
          className={titleClassName || "text-2xl md:text-3xl font-display font-bold text-text"}
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
