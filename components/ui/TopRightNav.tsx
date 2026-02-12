"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const linkClass =
  "fixed top-4 right-4 z-[100] rounded-full px-4 py-2 text-body-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-neutral-900 border border-white/10 bg-neutral-900/95 backdrop-blur-md dark:bg-neutral-950/95 dark:border-white/5";

export function TopRightNav() {
  const pathname = usePathname();
  const isPlayground = pathname === "/playground";

  if (isPlayground) {
    return (
      <Link href="/" className={linkClass} aria-label="Back to home">
        Home
      </Link>
    );
  }

  return null;
}
