"use client";

import { usePathname } from "next/navigation";
import { ArrivalCover } from "./ArrivalCover";

/**
 * Renders ArrivalCover only on the home page. Must live in the layout
 * outside #main-content so the cover stays visible when #main-content is hidden.
 */
export function ArrivalCoverGate() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <ArrivalCover />;
}
