"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically imported (no SSR) so the gate's three.js dependency only loads
// on the home route, not in every route's shared first-load JS.
const ArrivalCover = dynamic(
  () => import("./ArrivalCover").then((m) => m.ArrivalCover),
  { ssr: false },
);

/**
 * Renders ArrivalCover only on the home page. Must live in the layout
 * outside #main-content so the cover stays visible when #main-content is hidden.
 */
export function ArrivalCoverGate() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <ArrivalCover />;
}
