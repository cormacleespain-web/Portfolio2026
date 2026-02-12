import { type ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  /** Optional variant: default is subtle; "accent" for highlight */
  variant?: "default" | "accent";
  className?: string;
}

/**
 * Small label for role, timeframe, category, read time, etc.
 * Easy to skim in cards and lists.
 */
export function Tag({
  children,
  variant = "default",
  className = "",
}: TagProps) {
  const base =
    "inline-flex items-center rounded-md px-2 py-0.5 text-caption font-medium";
  const styles =
    variant === "accent"
      ? "bg-accent-muted text-accent"
      : "bg-surface border border-border-subtle text-text-muted";

  return <span className={`${base} ${styles} ${className}`.trim()}>{children}</span>;
}
