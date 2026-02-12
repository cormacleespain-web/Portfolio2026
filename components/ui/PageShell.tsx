import { type ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  /** Optional: use a different element (e.g. for article wrapper) */
  as?: "div" | "main" | "article";
  /** Extra class for the inner container */
  className?: string;
}

/**
 * Page grid container: 4U / 8U / 12U / 16U / 20U at sm/md/lg/xl.
 * Direct children are grid items; add page-grid-span-full or col-span-* for placement.
 */
export function PageShell({
  children,
  as: Component = "div",
  className = "",
}: PageShellProps) {
  return (
    <Component
      className={`page-grid mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
