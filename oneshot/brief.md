# Brief — Site-wide premium polish pass

**Style signals:** "extreme, premium and polished, as if designed by a product designer from Apple or Revolut. Expensive designer." Explicit style request → matches clash-resolution.md signal 1.
**References:** Apple, Revolut (named directly by Cormac). No Figma link given.
**Audience:** Recruiters / hiring managers evaluating a senior product designer.
**Chosen taste authority:** `high-end-visual-design` — explicit "make it feel high-end/expensive" signal, first-match in decision framework.
**Supplementary:** `impeccable` (on-demand critique/polish, named explicitly by Cormac) and `design-taste-frontend` (already used for the initial audit — findings below carry forward as the anti-slop checklist; not re-invoked as a competing primary authority).
**Suppressed for this task:** `industrial-brutalist-ui`, `minimalist-ui`, `ui-ux-pro-max` (styling role), `gpt-taste` (styling role), `stitch-design-taste`, `design-taste-frontend-v1` — per suppression table for `high-end-visual-design`.
**Existing brand override:** teal (#2dd4bf) + orange (#f97316) two-accent system and dark warm-neutral background are an established, deliberate brand identity — kept, not replaced with `high-end-visual-design`'s example palettes. Its Vibe Archetype closest to this brand: **Ethereal Glass** (dark tech/SaaS), adapted to the existing accent pair instead of purple/emerald.
**Task size:** Project (spans whole site: hero, nav, cards, case study system, footer, content copy, motion).

## Carried-forward findings from design-taste-frontend audit
1. Serif display font (Playfair Display) as default headline — replace with sans display.
2. Hand-rolled SVG nav icons — replace with an icon library.
3. Eyebrow label on every case-study section (9 components) — over limit.
4. Em-dashes in visible body copy (`content/projects.ts`).
5. Footer locale/time strip (Barcelona clock).
6. "Scroll / Swipe / Drag" rotating scroll cue in arrival cover.
7. `01/03` pagination pill on case study cards.
8. Same conic-gradient glow effect reused in 8 places — narrow motion vocabulary.
