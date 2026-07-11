"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Global reduced-motion gate for every Motion-driven animation in the app
 * (ScrollReveal, case-study entrances, card hovers, etc). `reducedMotion="user"`
 * makes Motion automatically honor prefers-reduced-motion without each
 * component needing its own useReducedMotion() check.
 */
export function MotionConfigProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
