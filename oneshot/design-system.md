# Design System

**Generated:** 2026-07-11 via manual audit (existing Tailwind config + globals.css) + `high-end-visual-design` refinement pass. Not regenerated from scratch — existing brand tokens are the baseline per the "existing brand assets" override; only the entries below are *changing*.
**Stack:** Next.js 16 + Tailwind v3 + Motion (`motion/react`) + GSAP/ScrollTrigger + React Three Fiber.

## Pattern & Style
Dark-only, warm-neutral background (not pure OLED black — keep the brand's existing `#0c0a09`). Vibe archetype: **Ethereal Glass**, adapted — glass/blur cards, hairline borders, nested "double-bezel" containers — but using the existing teal/orange accent pair instead of purple/emerald.

## Colors (unchanged — existing brand, kept)
- Background `#0c0a09`, Surface `#1c1917`, Surface-hover `#292524`
- Text `#fafaf9` / muted `#a8a29e` / subtle `#868380` (already AA-fixed, don't touch)
- Accent (teal) `#2dd4bf` / hover `#5eead4` / muted `#134e4a`
- Accent-2 (orange) `#f97316` / hover `#fb923c`
- Border `#292524` / subtle `#1c1917`

## Typography — CHANGING
- **Before:** `Inter` (sans body) + `Playfair_Display` (serif display) + `Ephesis` (script, hero name).
- **After:** `Geist` (via `next/font/google`) for both sans body and display, weight/tracking differentiated instead of a family swap. Drops Inter (banned, generic-AI default) and Playfair Display (banned serif-as-default AI tell — this isn't an editorial/luxury/publication brand). `Ephesis` stays — it's a one-off signature flourish on the hero name draw-on animation, not the default type system, so it's exempt from the serif/script discipline rule.
- Display weight: 600-700, `tracking-tighter`, sizes unchanged (`text-hero`/`text-display` clamp scale already reasonable).

## Effects — CHANGING
- **Double-Bezel nested cards:** outer shell (`bg-white/5`, `ring-1 ring-white/10`, `p-1.5`, `rounded-[2rem]`) wrapping an inner core (own bg, `shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]`, `rounded-[calc(2rem-0.375rem)]`). Applied to: case-study preview cards, experience featured card, hero employer badges.
- **Button-in-button CTA:** trailing-icon buttons (case-study "Read case study", footer copy-email) get the arrow/icon nested in its own circular `w-8 h-8 rounded-full bg-black/5` wrapper, not floating bare next to the label.
- **Macro-whitespace:** `Section.tsx` default padding bumped from `py-12 md:py-16` to `py-24 md:py-32` (this is a shared component — one change, applies site-wide).
- **Glow vocabulary diversified:** the single conic-gradient-spin glow currently on 8 different elements gets scoped down to 2-3 signature spots (primary CTA, one featured card) — everywhere else moves to soft diffused ambient shadows instead of the same spinning ring, so the site doesn't read as "one CSS trick repeated."
- **Radii:** exaggerated squircle (`rounded-[2rem]`) reserved for major cards/hero art; existing `rounded-xl`/`rounded-2xl` kept for smaller components (pills, badges, inputs) — one documented two-tier scale, not a blanket replace (avoids breaking the Shape Consistency Lock).

## Icons — CHANGING
Hand-rolled SVG nav icons (`FloatingNav.tsx`) → `@phosphor-icons/react` (Light weight, ultra-thin strokes per high-end-visual-design's icon ban on thick-stroke defaults). One family site-wide, `strokeWidth`/weight standardized.

## Motion
Existing `HERO_EASE = [0.16, 1, 0.3, 1]` already matches premium cubic-bezier guidance — kept, extended to components currently using default `ease-in-out`/linear transitions. Scroll-entry reveals move toward the fade-up + slight blur resolve pattern (`translate-y-16 blur-md opacity-0` → resolved) where not already using `ScrollReveal`/`whileInView`.

## Anti-patterns to avoid (carried from design-taste-frontend audit — still enforced under the new authority)
- No em-dashes in visible copy.
- Eyebrow labels max 1 per 3 sections — **root cause found:** `Section.tsx`'s default `titleClassName` bakes `uppercase tracking-wider` into every section heading. Fix at the component default, not per-instance.
- No section-number pagination pills (`01/03`).
- No locale/time decorative strips unless brief justifies (flagged, not auto-removed — confirm with Cormac).
- No scroll-cue text ("Scroll / Swipe / Drag").
