# QA Report — Site-wide premium polish pass

**Task size:** Project
**Authority:** high-end-visual-design (supplementary: impeccable, design-taste-frontend anti-pattern rules)
**Date:** 2026-07-11

## Automated verification

- `tsc --noEmit`: clean after every phase.
- `eslint .`: clean after every phase (two unused-var warnings surfaced mid-work from dead props left over after removing the `01/03` pagination pill and a numbered eyebrow — both fixed immediately).
- `next build`: succeeds, all 16 routes generate, after every phase.
- `npx playwright test` (full suite, production build, real Chromium): **33/33 passed.** Includes:
  - `axe.spec.ts` — zero critical/serious accessibility violations on home + all 6 case-study pages.
  - `home.spec.ts` — all five home sections render, no console errors.
  - `arrival-gate.spec.ts` — password gate keyboard/AT path still works (unaffected by the icon/motion changes).
  - `chat.spec.ts` — chat widget open/close and error-copy paths still work (icons swapped, behavior unchanged).
  - `case-studies.spec.ts` — all 7 case study pages render their titles; unknown slug still 404s.

## Manual browser verification

Confirmed via direct DOM inspection (`elementFromPoint`, `getComputedStyle`, image `naturalWidth`/`complete`) at the hero and at the Selected Works / Experience sections:
- Geist Sans renders correctly (hero headline, nav).
- Double-Bezel classes (`bezel-outer`/`bezel-inner`) apply correctly to the case-study preview card; the project image loads and renders at full opacity inside it.
- Phosphor icons render in the nav and chat FAB.
- Signature glow (nav pill) still renders.

**Known tooling limitation:** the Browser pane's screenshot capture renders solid black for any scroll position past the hero on this page (reproduced in both the Selected Works and Experience sections, i.e. not specific to the Double-Bezel edit). DOM inspection at those exact scroll positions confirms the real content is present, correctly styled, and fully opaque — this looks like a screenshot/compositing quirk in this session's automation tooling on a page with large sticky/pinned sections, not a rendering regression. Recommend a final human eyeball pass on a normal browser (e.g. once the other session's dev server is free) since this tool couldn't produce a full-page visual screenshot below the fold.

## Findings carried through from the design-taste-frontend audit — status

| Finding | Status |
|---|---|
| Serif display font as default | Fixed — Geist |
| Hand-rolled SVG icons | Fixed — Phosphor, site-wide (more files than originally scoped) |
| Eyebrow overuse on every case-study section | Fixed at the root cause (`Section.tsx` default + `CaseStudySection.tsx` per-block heading, the actual volume driver) |
| Em-dashes in visible copy | Fixed — all confirmed-visible instances rewritten; instances in never-displayed API error bodies and LLM system-prompt text left alone (verified not user-facing) |
| Footer locale/time strip | Kept — Cormac's explicit call |
| "Scroll/Swipe/Drag" cue | Removed |
| `01/03` pagination pill | Removed |
| Narrow glow vocabulary (one conic-spin effect x8) | Diversified — removed a fully redundant duplicate layer, fixed an off-brand purple/pink leak found along the way |

## New issue found and fixed during this pass (not in original audit)
Motion-library animations (as opposed to hand-written CSS) had zero `prefers-reduced-motion` support anywhere in the app. Fixed with a single `MotionConfig reducedMotion="user"` wrapper in `layout.tsx`.
