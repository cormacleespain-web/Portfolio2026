"use client";

import { useState, useEffect } from "react";

/** Max parallax offset in pixels; stars follow the mouse by this much. */
const PARALLAX_MAX_PX = 10;

/**
 * Full-viewport starfield + shooting star animation for the home page.
 * Renders at the very back (below page content). Theme-aware: more visible in dark mode.
 * Starfield subtly follows mouse direction for a gentle parallax effect.
 */
export function ShootingStarBackground() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Deterministic star positions (percent) so no hydration mismatch
  const starPositions = [
    [5, 10], [12, 22], [18, 8], [25, 35], [30, 15], [38, 42], [45, 28], [52, 5],
    [58, 48], [62, 18], [70, 32], [75, 12], [82, 38], [88, 25], [92, 45], [8, 55],
    [15, 62], [22, 52], [28, 68], [35, 58], [42, 72], [48, 65], [55, 78], [65, 55],
    [72, 62], [78, 48], [85, 70], [10, 82], [20, 88], [32, 85], [50, 92], [68, 80],
    [80, 90], [90, 75],
  ];

  const parallaxX = mouseOffset.x * PARALLAX_MAX_PX;
  const parallaxY = mouseOffset.y * PARALLAX_MAX_PX;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Static / twinkling starfield — staggered delay & duration so they don’t sync */}
      <div
        className="starfield absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        }}
      >
        {starPositions.map(([left, top], i) => {
          // Spread delays across 0–5s using a prime-ish step so each star gets a different phase
          const delay = (i * 0.137) % 5;
          // Vary duration (2.1s–3.6s) so stars drift out of phase over time
          const duration = 2.1 + (i % 11) * 0.15;
          return (
            <span
              key={i}
              className="star absolute h-px w-px rounded-full bg-white"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay.toFixed(2)}s`,
                animationDuration: `${duration.toFixed(2)}s`,
              }}
            />
          );
        })}
      </div>

      {/* Shooting star streaks — diagonal top-left to bottom-right */}
      <div className="shooting-star shooting-star-1" />
      <div className="shooting-star shooting-star-2" />
      <div className="shooting-star shooting-star-3" />
      <div className="shooting-star shooting-star-4" />
      <div className="shooting-star shooting-star-5" />
    </div>
  );
}
