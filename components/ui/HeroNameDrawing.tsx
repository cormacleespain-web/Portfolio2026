"use client";

import { motion } from "motion/react";
import {
  HERO_NAME_GLYPHS,
  HERO_NAME_HEIGHT,
  HERO_NAME_VIEWBOX,
  HERO_NAME_WIDTH,
} from "./hero-name-paths";

const REVEAL_DURATION = 0.46;
const GLYPH_STAGGER = 0.035;
const GLYPH_FADE_DURATION = 0.12;
const TOTAL_ANIM_TIME = REVEAL_DURATION;

/** Total seconds from mount until the last glyph finishes revealing. */
export const HERO_NAME_ANIM_DURATION = TOTAL_ANIM_TIME;

const SIGNATURE_WIDTH_EM = HERO_NAME_WIDTH / HERO_NAME_HEIGHT;

interface HeroNameDrawingProps {
  dismissed?: boolean;
}

export function HeroNameDrawing({ dismissed = true }: HeroNameDrawingProps) {
  return (
    <span
      className="relative top-[0.1em] inline-block align-baseline text-[1.28em]"
      style={{ width: `${SIGNATURE_WIDTH_EM}em` }}
      role="img"
      aria-label="Cormac Lee"
    >
      <motion.span
        className="block overflow-hidden"
        initial={{ width: "0%" }}
        animate={dismissed ? { width: "100%" } : undefined}
        transition={{
          duration: REVEAL_DURATION,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <svg
          viewBox={HERO_NAME_VIEWBOX}
          className="h-[1em] w-auto"
          fill="currentColor"
          role="img"
          aria-hidden
        >
          {HERO_NAME_GLYPHS.map((glyph, i) => (
            <motion.path
              key={`glyph-${i}`}
              d={glyph.d}
              fill="currentColor"
              initial={{ opacity: 0.2 }}
              animate={dismissed ? { opacity: 1 } : undefined}
              transition={{
                delay: i * GLYPH_STAGGER,
                duration: GLYPH_FADE_DURATION,
                ease: "easeOut",
              }}
            />
          ))}
        </svg>
      </motion.span>
    </span>
  );
}
