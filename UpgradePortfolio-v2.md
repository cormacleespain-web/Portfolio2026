# UpgradePortfolio-v2

**Portfolio v2 Upgrade — Audit & Implementation Roadmap**

| | |
|---|---|
| Version | 1.0 |
| Date | 10 July 2026 |
| Author context | Cormac Lee — Senior Product Designer (Wizeline / Dow Jones); personal portfolio at `cormacleespain-web/Portfolio2026` |
| Status | Plan approved for implementation on branch `upgrade/portfolio-v2` |

---

## §0. How to Use This Document

This document is the complete plan for Portfolio v2. **No code was changed while producing it.** Implementation happens on a new branch `upgrade/portfolio-v2` (see §16), one pull request per roadmap phase (see §17). Every task in the roadmap is written to be self-contained — with file paths and acceptance criteria — so it can be executed by Claude Code or Cursor interchangeably, mid-phase tool-switching included.

**Legend**

- **P0** — broken or blocking (functional failure, WCAG hard-fail, runtime error)
- **P1** — significant (materially hurts quality, credibility, or reach)
- **P2** — polish (worth doing, not urgent)
- `[AUTHOR INPUT NEEDED]` — a fact only Cormac can supply. Every occurrence is collected in **Appendix B**. Nothing marked this way may be invented during implementation.
- Finding IDs (`T1`, `A3`, `D2`…) are indexed in **Appendix A** and referenced by roadmap phases so nothing audited is silently dropped.

All `file:line` citations were verified against the working tree on 10 July 2026. Line numbers will drift as implementation proceeds; treat the file + description as authoritative.

---

## §1. Executive Summary

The portfolio is a visually ambitious dark-theme Next.js 16 site with genuinely strong motion craft — a shader-driven particle sphere arrival gate, scroll-pinned case study panels, a spring-physics carousel, and an elastic SVG footer. That craft is the site's signature and must be preserved. Around it, however, sit real problems: the AI chatbot is broken at runtime (placeholder API key, error swallowed by an empty `catch`), search engines see almost nothing (no sitemap, robots, Open Graph, or structured data), keyboard and screen-reader users **cannot get past the arrival gate at all**, and only 3 of 12 projects have real case study content — with the two most impressive engagements of Cormac's career (Oxford Analytica and Global Risk Monitor at Dow Jones) entirely absent.

The v2 thesis: **two new NDA-safe flagship case studies on a hardened, findable, accessible site.** The design language gets a deliberate decision — refine or reset (§4 recommends a "confident editorial" reset that fits the risk-intelligence story OA/GRM tell) — executed as design tokens first so every downstream fix lands on a stable foundation.

**Top 5 highest-leverage items**

| # | Item | Why it matters | Phase |
|---|------|----------------|-------|
| 1 | Oxford Analytica + GRM case studies (§13, §14) | The strongest work Cormac has is invisible; these reposition the portfolio from "telco + student work" to "global decision-making platforms" | 6 |
| 2 | Arrival gate keyboard/AT path (§8, A1–A2) | A hiring manager using a keyboard or screen reader currently cannot enter the site | 2 |
| 3 | Chatbot recovery (§7) | A broken flagship feature is worse than no feature | 3 |
| 4 | SEO from zero (§10) | The portfolio is effectively unindexed; every share renders without a preview card | 4 |
| 5 | Design token consolidation (§4) | Accent sprawl (teal token + hardcoded orange/green/sky/fuchsia) undermines the "designer with taste" claim the site exists to make | 1 |

**Scope exclusion, stated up front:** Country Risk Review (CRR) is excluded from this iteration entirely — no routes, no navigation, no chatbot knowledge, no metadata, no content (§2, §15).

---

## §2. Scope & Exclusions

**In scope:** architecture, components, performance, accessibility, SEO, design system, motion, responsive design, visual hierarchy, typography, interaction design, content strategy, portfolio positioning, chatbot, testing, git workflow, release strategy — audited in §3–§11, actioned in §17.

**Out of scope:**

- **Country Risk Review (CRR)** — hard exclusion for this iteration, by author decision. No routes, no navigation entries, no chatbot system-prompt knowledge, no metadata, and no public content relating to CRR anywhere in the site. This constraint is restated in §15 and enforced by a grep check in §19. GRM content must be written so it does not describe or imply CRR features (§14).
- **Chatbot provider switch** — decision made: stay on OpenAI, model `gpt-4o-mini`.
- **CMS migration** — content stays in `content/*.ts` per the existing `CONTENT_EDIT_GUIDE.md` workflow.
- **Real access control** — the password gate remains a soft/ceremonial gate (see T5 and the §10 indexability decision).

---

## §3. Technical Audit

### 3.1 Stack inventory

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.1 App Router, Turbopack (`next dev`), React 19.2 | `dev:webpack` fallback script exists |
| Styling | Tailwind 3.4, tokens as CSS custom properties in `styles/globals.css`, mapped in `tailwind.config.ts` | Dark theme forced via inline script in `app/layout.tsx:30` |
| Animation | `motion` 12 (Framer successor) **and** GSAP 3.14 + ScrollTrigger (`lib/gsap.ts`) | Two libraries, overlapping duties — see §6 |
| 3D | `@react-three/fiber` 9 / `drei` 10 / `three` 0.182 | Arrival gate + `/playground` |
| AI | `openai` 6.27, streaming SSE | Broken at runtime — §7 |
| Fonts | `next/font` Google: Playfair Display (footer email), Ephesis (signature); body = system stack | Ephesis also baked to SVG paths at build time by `scripts/generate-name-svg.mjs` (opentype.js) |
| Tests | None | §11 |

### 3.2 Architecture map

```
app/
  layout.tsx          server — forced dark, arrival-gate inline script, chrome mounts
  page.tsx            server — Hero, SelectedWorks, Experiences, AllWork, OtherWorks
  work/[slug]/page.tsx server — SSG via generateStaticParams; CaseStudy* components
  playground/page.tsx  server — full-screen RocketScene
  api/chat/route.ts    POST — OpenAI streaming chat
  api/unlock/route.ts  POST — password check against SITE_PASSWORD
content/
  projects.ts          Project interface + 12 entries (3 structured, 4 stubs, 5 hidden)
  siteData.ts          hero / experiences / achievements / education / testimonials / contact / brands
components/            sections/ ui/ three/ work/ chat/
```

Content model is sound: `Project` (`content/projects.ts:17-47`) already supports `role`, `team`, `tools`, `problem`, `impact[]`, `sections[]` (heading/body/image/aspect/callout), `reflection`, `nextProject`. The case study framework (§12) extends rather than replaces it.

### 3.3 Findings

| ID | Sev | Where | Finding | Fix sketch | Phase |
|----|-----|-------|---------|------------|-------|
| T1 | P0 | `app/api/chat/route.ts:134` | Empty `catch {}` collapses every upstream failure (401 bad key, 429 quota, model errors) into a generic 500. Live-verified: chat request → `500 Internal Server Error` → UI shows "Sorry, something went wrong: Internal server error" | Differentiated error handling + server-side logging (§7) | 3 |
| T2 | P0 | `components/sections/Experiences.tsx` | Duplicate React key `"University of Limerick"` — timeline keyed by company name; two UL entries (`timelineGroup: "ul-intern"` / `"ul-social"` in `content/siteData.ts:121,123`) collide. Live-verified: console floods with dozens of duplicate-key errors | Key by `timelineGroup ?? company + timeframe` | 0 |
| T3 | P1 | `app/work/[slug]/page.tsx:153,261`; `components/work/CaseStudyHero.tsx:33` | Lint errors: raw `<a>` to internal pages (`@next/next/no-html-link-for-pages`) | Replace with `next/link` | 0 |
| T4 | P1 | `components/chat/ChatWidget.tsx:16`, `components/sections/SelectedWorks.tsx:47`, `hooks/useArrivalDismissed.ts:16` | Lint errors: synchronous `setState` in effect body (`react-hooks/set-state-in-effect`); plus warning in `CaseStudyPinnedPanels.tsx:110` (`panelLabels` invalidates `useCallback` deps) | `useSyncExternalStore` for the matchMedia hooks; `useMemo` for panelLabels | 0 |
| T5 | P1 | `app/api/unlock/route.ts`, `components/ui/ArrivalCover.tsx:117` | Gate is purely cosmetic: API returns `{ok:true}` with no cookie/session; access flag is client-set `sessionStorage`. All pages and `/api/chat` are reachable without the password. No `middleware.ts` exists | Accept and document as ceremonial (recommended — see §10 indexability), or add middleware + httpOnly cookie | 4 (decision) |
| T6 | P2 | `app/api/chat/route.ts:88,103` | No request validation: missing/malformed `messages` throws into the catch; no message length/count caps | Validate shape, cap lengths (§7.3) | 3 |
| T7 | P2 | `app/api/unlock/route.ts:19` | Plaintext, non-constant-time password comparison | Low value target; `timingSafeEqual` if kept | 4 |
| T8 | P2 | Multiple (`Hero`, `CaseStudyPinnedPanels`, `ChatWidget` sheet `85vh`) | `100vh`/`h-screen` instead of `dvh` — mobile browser-chrome jump | Swap to `dvh` with fallback | 2 |
| T9 | P2 | `components/ui/RotatingTitle.tsx:11-16` | Mutates `document.title` every 2.5 s — overrides metadata, churns SR announcements, garbles history/SEO title | Remove, or animate a DOM element instead of the tab title | 4 |

### 3.4 Dead code register

| Item | Location | Recommendation |
|---|---|---|
| `Testimonials`, `Achievements`, `Education` sections | `components/sections/` (unimported); placeholder data in `content/siteData.ts:126-143` | Delete components for now; **keep** the siteData fields. Real testimonials/awards are high-credibility content — `[AUTHOR INPUT NEEDED]` whether any exist to publish (App. B-1) |
| `ThemeToggle` | `components/ui/ThemeToggle.tsx` (dark forced) | Delete along with the dead `html.light` block in `styles/globals.css:24-39` — **unless** §4 Option B revives a light theme; decide in Phase 1 |
| `Rocket.tsx` | `components/three/Rocket.tsx` (unimported) | Delete |
| 5 hidden legacy project stubs | `content/projects.ts:246-291` (`hidden: true`, placeholder copy) | Delete entries; they're reachable by URL and render placeholder text — a credibility leak |
| `mcp.json` html.to.design proxy | repo root | Keep (authoring tool), but confirm the embedded instance URL isn't sensitive `[AUTHOR INPUT NEEDED]` (App. B-2) |

---

## §4. Design Audit & Redesign Proposal

### 4.1 Current visual language — audit

**What works (preserve):** the black-void arrival moment with the orange/gold particle sphere is memorable and technically impressive; the scroll-pinned case study panels give long-form content rhythm; the Ephesis signature + hand-drawn glyph animation is a distinctive personal mark; the footer (Playfair email, Barcelona clock, elastic wave) is the most confident, coherent moment on the site.

**What doesn't:**

| ID | Sev | Finding |
|----|-----|---------|
| D1 | P1 | **Accent sprawl.** The token system defines teal (`--color-accent: #2dd4bf`, `styles/globals.css:15`) — but the hero headline hardcodes orange, green, sky, and fuchsia (`globals.css:94-118`), the ChatWidget hardcodes orange `#fb923c` (`ChatWidget.tsx:225,231,253,307,347`), the arrival sphere renders orange/gold, and CTAs/glows use a teal→violet→pink gradient. Live-verified: five accent families visible in the first two viewports. No hierarchy survives this. |
| D2 | P1 | **No body typeface.** Display moments get Playfair/Ephesis; everything else falls to the system font stack with no token (`tailwind.config.ts:32-35` defines only `contact-email` and `hero-name`). For a designer's portfolio, body typography *is* the product demo. |
| D3 | P1 | **Empty image voids in case studies.** Sections declare `imageAspect` without `image` (e.g. `content/projects.ts:85,99`), rendering large dark placeholder blocks. Live-verified on `/work/my3-case-study`: viewport-scale empty rectangles between sections. Kills the premium feel more than any styling choice. |
| D4 | P2 | **Undefined `ring` token.** `layout.tsx:56` uses `ring-ring`/`ring-offset-background`; no `ring` color exists in `tailwind.config.ts` — focus rings render default blue, off-brand. |
| D5 | P2 | **Gradient CTA contrast** — white text over the pink `#ec4899` stop measures ~3.4:1 (below 4.5:1 for normal text). Cross-ref A7. |
| D6 | P2 | **Card-on-gradient sections** (SelectedWorks violet band, OtherWorks band) read as a different site from the black-void hero and stone-dark case studies — three visual temperatures with no bridge. |

### 4.2 Redesign proposal

The author is open to a redesign. Two options, one recommendation:

**Option A — Refine.** Keep stone-dark + teal. Add a real body typeface, collapse all accents to teal + one warm counterpoint (the sphere's orange, formalized as a token), tame the tri-color gradient to a single signature use (arrival gate only), recolor the hero headline words to the two-accent system, retint case-study bands to stone. Effort: ~2–3 sessions, low risk, site stays recognizably itself.

**Option B — "Confident editorial" reset (recommended).** The OA/GRM story is *risk intelligence for global decision-makers* — an editorial, analytical world (and Dow Jones is a publishing company). Reset the language to match: near-black warm neutrals; a serious editorial serif for display (e.g. Playfair promoted from footer-only to the display face, or a sharper alternative); a quietly excellent sans for body/UI; **one** accent used sparingly (the existing teal is defensible; a signal-orange derived from the sphere is the more distinctive choice); data-viz-quality neutrals for tables/metrics in case studies; gradients retired except the arrival gate. Ephesis signature stays — it's the personal mark. Effort: ~4–5 sessions. Risk: medium (every section gets touched), mitigated by executing as **tokens first** — palette/type swap lands in one PR, spatial/component polish follows.

Recommendation: **Option B.** The current language is trend-coded (glow gradients, starfields) and works against the seniority the content now claims. The reset also gives OA/GRM case studies a native visual home (editorial layouts, maps, tables — §14).

**Decision gate:** `[AUTHOR INPUT NEEDED]` — Option A or B before Phase 1 starts (App. B-3).

### 4.3 Design token plan (applies to either option)

In `styles/globals.css` + `tailwind.config.ts`:

- `--font-body` + Tailwind `fontFamily.sans` override; full type scale review (existing `fontSize` scale in `tailwind.config.ts:24-31` is a good base — extend with `display` sizes for case study heroes).
- `ring` color token (fixes D4) tied to accent.
- Collapse accent tokens to `accent` + `accent-2` (warm counterpoint); delete per-word hero hardcodes (`globals.css:94-118`); ChatWidget consumes tokens, not `#fb923c`.
- Decide the light theme's fate: delete `html.light` block or complete it (Option B could ship a light "reading mode" for case studies later — out of v2 scope, note only).
- Spacing rhythm: audit section paddings to a consistent scale while touching tokens.

### 4.4 Motion audit summary

Detailed in §6. Headline: the craft is high but reduced-motion coverage is partial (3D and starfield never stop — A4), and two animation libraries do overlapping work.

---

## §5. Page-by-Page Review

Live-reviewed 10 July 2026, desktop 800×832 and mobile 375×812, via dev server.

### 5.1 `/` — Home

- **Arrival gate (step 1, password):** black void + particle sphere + minimal input. Strong first impression. Findings: focusable input inside `aria-hidden` (A1), no SR perception of the gate at all.
- **Arrival gate (step 2, scroll-to-enter):** "Scroll / Swipe / Drag" rotating verb + teal/violet edge glow. Live-verified: `ArrowUp`/`PageDown`/`Enter`/`Space` do nothing — keyboard users are hard-trapped (A2). Reduced-motion users get an instant snap once *pointer* input crosses the threshold, but still need pointer input.
- **Hero:** signature draw animation + multi-color headline (D1) + starfield. `RotatingTitle` churns the tab title (T9). Employer favicons (Wizeline "W", Dow Jones "D") render at text size — charming but at 16 px the Dow Jones favicon reads as a generic blue square `[AUTHOR INPUT NEEDED]` whether to keep favicons or switch to monochrome wordmarks (App. B-4). Hero CTAs (`View Case Studies` / `See How I lead`) sit below the fold at common laptop heights — hierarchy loss.
- **SelectedWorks:** full-bleed violet gradient band with product-shot cards. The three structured projects rotate here. Visual temperature clash with hero (D6).
- **Experiences:** timeline with favicons. Duplicate-key runtime error (T2). Content is real and current.
- **AllWork ("Case Studies" carousel):** spring physics feel excellent with a pointer. 407 `/work/` links rendered for the infinite illusion (live count; 4,524 DOM nodes total on home) — tab-order and AT disaster, perf weight (A8/P3). Arrow-key support exists but tab focus walks hundreds of clones.
- **OtherWorks ("People I've Worked With"):** gradient band + white logo cards marquee. Duplicate logo set announced twice to SR (A9). White cards on gradient — heaviest visual moment on the page for the least important content.
- **Footer:** the best-designed section on the site. Keep as-is through any redesign; retint only.

### 5.2 `/work/[slug]` — Case studies

- Hero (parallax cover, title, tagline, role/team/tools columns) is clean and confident; teal used correctly here.
- Pinned-panel sections work well with a mouse; static fallback below 768 px and under reduced motion already exists (`CaseStudyPinnedPanels.tsx` matchMedia branches) — the *pattern* to copy for every other animation.
- **Empty image voids** (D3) between sections on `my3-case-study` — the single biggest quality gap on these pages.
- Only `my3-case-study`, `three-ireland-comp`, `youngbank` are real. `crewpay-pwa`, `grad-cap`, `fitprint`, `helping-hand-student-employment-app` render "Add your case study content…" placeholder text on production URLs — credibility leak (C1). Hide or complete in Phase 5 `[AUTHOR INPUT NEEDED]` which of the four to keep (App. B-5).
- Impact metrics: MyThree's `+↑` "User satisfaction" value (`content/projects.ts:73`) is a placeholder pretending to be data — worse than omitting it (C2).
- Back-links are raw `<a>` (T3).

### 5.3 `/playground`

Rocket scene with OrbitControls. On mobile, live-verified: `#main-content` renders at 0 height — the page presents as a black void with the footer floating in it; canvas is behind everything (T10 — P1, fix or gate the route). Purpose of the page is unclear to a visitor `[AUTHOR INPUT NEEDED]`: keep as an easter egg (link it from somewhere), or cut for v2 (App. B-6). Not in any navigation currently — only reachable by URL.

### 5.4 Global chrome

- **FloatingNav:** desktop pill with conic glow; hides against footer via GSAP. Mobile FAB radial menu. Both good. Raw-`<a>` same-page links inside it are correct for hash-links (lint doesn't flag them — the flagged ones are T3's page links).
- **ChatWidget:** orange FAB (D1); desktop panel + mobile drag-sheet. No dialog semantics, no Escape (live-verified), no focus trap, no `aria-live` (A3).
- **Skip link** exists and works; its ring token is undefined (D4).

---

## §6. Motion Strategy

**Inventory:** GSAP + ScrollTrigger owns scroll choreography (`CaseStudyPinnedPanels`, `FloatingNav` hide-on-footer, `Footer` elastic wave — all via `lib/gsap.ts` with `useGSAP` + `matchMedia`). `motion` 12 owns enter/exit and springs (14 components: `ScrollReveal`, `AllWork` physics, `ChatWidget` sheet, `CaseStudyHero` parallax, `HeroNameDrawing`, `FloatingNav` radial menu). R3F owns the two 3D scenes with their own GSAP timelines. CSS keyframes own glows, marquee, stars, arrival reveals.

**Principles for v2:**

1. **Reduced motion is a contract, not a garnish.** Every animation ships with a `prefers-reduced-motion` branch. Current violations: `NoiseSphereScene` (perpetual GSAP yoyo timeline + `useFrame` rotation, `NoiseSphereScene.tsx:72-102`), `ShootingStarBackground` twinkle/parallax, marquee (only hidden on mobile). The `CaseStudyPinnedPanels` matchMedia pattern is the house style — reuse it.
2. **Motion never gates content by input type.** The arrival gate violates this (A2). Rule: any gesture-driven interaction has a keyboard and AT equivalent (button, key handler) that reaches the same state.
3. **Library consolidation — keep both, assign lanes.** Migrating either fully costs more than it returns. Codify: GSAP/ScrollTrigger for scroll-linked choreography only; `motion` for component enter/exit/gesture; no new CSS keyframe animations for anything stateful. Document in the repo (`AGENTS.md` addition, Phase 7).
4. **Pause what isn't seen.** 3D scenes stop their clocks when offscreen/tab-hidden (§9 P1).

**Motion spec for new case studies (OA/GRM):** restrained editorial rhythm — content sections use the existing `ScrollReveal`; pinned panels reserved for one "process" sequence per study; number count-ups (`CaseStudyImpact`) only on author-confirmed metrics; maps/data-viz imagery gets a single subtle parallax, nothing continuous. No new animation primitives needed — the existing set covers the spec.

---

## §7. Chatbot Recovery Plan

Decision: **keep OpenAI**, model `gpt-4o-mini`, streaming SSE — the pipeline is structurally sound (verified end-to-end: request shape, stream re-emission, client parsing all match).

### 7.1 Root cause

`.env.local` ships the placeholder `API_KEY=sk-your_openai_api_key`. It is non-empty, so the guard at `app/api/chat/route.ts:90` passes; OpenAI rejects with 401; the empty `catch {}` at `route.ts:134` discards it; the client renders "Sorry, something went wrong: Internal server error" (live-reproduced: `POST /api/chat → 500`). **Fix:** real key in `.env.local` and Vercel (per `docs/VERCEL_ENV_SETUP.md` pattern) `[AUTHOR INPUT NEEDED]` — key provisioning (App. B-7).

### 7.2 Error surfacing

- Catch specifically: OpenAI `APIError` status 401/403 → 503 "assistant unavailable" + `console.error` with status (never the key); 429 → 429 "busy, try again shortly"; other → 500 with server-side log of `err.message`.
- Client (`ChatWidget.tsx:98-106`) maps 503/429 to friendly, distinct copy.
- Never echo upstream error bodies to the client.

### 7.3 Hardening

- Validate body: `messages` is an array of `{role: "user"|"assistant", content: string}`, ≤ 20 items, each ≤ 4,000 chars; else 400 (fixes T6).
- Rate limiting: skip infrastructure; cap damage instead — `max_tokens` already 1024; add per-request message caps above. A portfolio bot behind Vercel doesn't warrant a rate-limit store; revisit only if usage bills surprise. (Trade-off stated for the record.)
- `env` naming: keep `API_KEY` (internally consistent across route, `.env.example`, docs) but add a comment in `.env.example` noting it is the OpenAI key — the unconventional name is a known trap.

### 7.4 Widget accessibility (cross-ref A3)

`role="dialog"` + `aria-label` on panel/sheet; focus trap while open; Escape closes (currently doesn't — live-verified) and returns focus to the FAB; streamed replies announced via a visually-hidden `aria-live="polite"` region that announces **on message completion** (announcing per-token is SR noise); typing indicator gets `aria-hidden` + a single "Assistant is typing" live announcement.

### 7.5 Knowledge refresh

System prompt builds from `content/` at module load (`route.ts:84`) — so OA/GRM knowledge arrives automatically when Phase 6 content lands. Confidentiality rules (§15) apply to the prompt: only final published case-study copy feeds it; **zero CRR content**; add a system-prompt instruction to decline questions about unreleased/confidential work gracefully.

---

## §8. Accessibility Plan

### 8.1 Findings

| ID | Sev | WCAG | Where | Finding |
|----|-----|------|-------|---------|
| A1 | P0 | 4.1.2, 1.3.1 | `ArrivalCover.tsx:361` (root `aria-hidden`), input at `:392-403` | Focusable password input inside `aria-hidden` subtree; gate imperceptible to AT |
| A2 | P0 | 2.1.1, 2.1.2 | `ArrivalCover.tsx:231-338` | Step-2 dismissal is wheel/touch/drag only; keyboard hard trap (live-verified: no key reaches it) |
| A3 | P1 | 4.1.2, 4.1.3 | `ChatWidget.tsx` | No dialog role, focus trap, Escape, or live region (live-verified) |
| A4 | P1 | 2.3.3 | `NoiseSphereScene.tsx:72-102`, `ShootingStarBackground.tsx` | Perpetual animation ignores `prefers-reduced-motion` |
| A5 | P1 | 2.4.2 | `RotatingTitle.tsx` | Title churn every 2.5 s (= T9) |
| A6 | P1 | 2.4.3 | `AllWork.tsx` | 407 focusable carousel links in tab order (live count) |
| A7 | P1 | 1.4.3 | `.hero-cta-primary`, OtherWorks band | White on pink stop ≈ 3.4:1 (= D5); re-measure after Phase 1 palette |
| A8 | P2 | 1.4.13/4.1.2 | `ArrivalCover.tsx:400` | Password input focus style is a barely-visible white ring on black |
| A9 | P2 | 1.1.1 | `OtherWorks.tsx` | Marquee duplicate logo set announced twice (only `display:none` under reduced motion) |
| A10 | P2 | 2.4.7 | `layout.tsx:56` + `tailwind.config.ts` | `ring` token undefined → default blue focus ring (= D4) |

### 8.2 Remediation groups

**Quick fixes (no design decision):** A1 (remove `aria-hidden` from root; scope it to decorative children), A2 (add keydown handler — Enter/Space/ArrowUp advance progress; plus a visible "Enter site" button rendered for keyboard/AT focus — this is also the reduced-motion path), A3 (per §7.4), A5 (remove component), A9 (`aria-hidden` on the duplicate set), A10 (token).

**Need Phase-1 design decisions:** A4 (what does the sphere do under reduced motion — static frame render recommended), A6 (curate the carousel to real projects ~6–8 items, virtualize DOM, `inert` on clones — design call on the "infinite" illusion), A7 (palette-dependent).

### 8.3 Manual test protocol (run in Phase 7, per §19)

1. Keyboard-only journey: unlock gate → enter site → reach every section → open/close chat → traverse one case study → footer links. No traps, visible focus throughout.
2. VoiceOver (Safari): home + one case study + full chat exchange. Gate perceivable and passable; streamed reply announced once.
3. OS reduced-motion on: no perpetual motion anywhere; gate passable via button.
4. axe-core scan (via §11 Playwright): zero critical/serious on `/`, all case studies, `/playground` (if kept).

---

## §9. Performance Plan

No numeric claims asserted pre-measurement; protocol first, budgets as targets.

### 9.1 Measurement protocol (Phase 0 baseline, Phase 7 comparison)

- Lighthouse (mobile + desktop) on `/` and `/work/my3-case-study` — production build (`npm run build && npm start`).
- `next build` route-size table snapshot; note first-load JS per route.
- Chrome performance profile: 30 s idle on home with sphere dismissed and starfield running; record main-thread and GPU time.

### 9.2 Known targets

| ID | Sev | Target | Plan |
|----|-----|--------|------|
| P1 | P1 | `NoiseSphereScene` 30k particles + 162² sphere runs whenever mounted | Pause clock + RAF when offscreen/tab-hidden (`document.visibilitychange`, IntersectionObserver); static frame under reduced motion (A4); consider particle count 30k→10k on `navigator.hardwareConcurrency ≤ 4` or mobile |
| P2 | P1 | three.js in first-load JS for `/` via ArrivalCover | Dynamic-import `RocketScene` (`next/dynamic`, no SSR); verify `/work/*` bundles exclude three entirely |
| P3 | P1 | AllWork 401 rendered cards (live: 407 links, 4,524 DOM nodes on home) | Curate + virtualize (A6); target < 1,500 DOM nodes on home |
| P4 | P2 | `100vh` units (T8) | `dvh` sweep |
| P5 | P2 | Dead code (§3.4) in bundle | Delete in Phase 1 |
| P6 | P2 | Fonts: two Google families + build-time SVG paths | Confirm `display: swap` holds after §4 font changes; subset new body face |

### 9.3 Budgets (Definition of Done inputs)

Home, mobile, production: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**, first-load JS ≤ 250 kB gzip (excluding lazily-loaded three chunk); case study pages: LCP ≤ 2.0 s. If Phase 0 baseline already beats a budget, the budget ratchets to the baseline (no regressions).

---

## §10. SEO Plan (greenfield)

Everything below is additive — the site currently ships only `title: "Cormac Lee"` / `description: "Personal portfolio"` (`app/layout.tsx:25-28`) and per-project titles (`app/work/[slug]/page.tsx:76-82`).

1. **`metadataBase` + canonical** in `app/layout.tsx`; site-wide title template (`"%s — Cormac Lee"`), real description `[AUTHOR INPUT NEEDED]` — canonical production domain (App. B-8).
2. **Per-page metadata:** extend `generateMetadata` in `work/[slug]` with description (from `tagline`/`problem`), OG + Twitter card fields.
3. **`app/sitemap.ts`:** home + visible, non-stub projects only (excludes hidden slugs — and, structurally, anything CRR-related can never appear).
4. **`app/robots.ts`:** allow all, reference sitemap.
5. **OG images:** dynamic per case study via `next/og` (`opengraph-image.tsx` under `work/[slug]`) — title + category on brand background; static fallback for home. This is also a design asset — build in Phase 4 using Phase 1 tokens.
6. **JSON-LD:** `Person` on home (name, jobTitle, sameAs: LinkedIn); `CreativeWork` per case study.
7. **Kill `RotatingTitle`** (T9/A5) — the churning title is actively hostile to SEO snippets.
8. **Indexability decision:** the gate is client-side, so all content is already in the SSG HTML and indexable — the password is ceremony. Recommended: keep it that way (portfolio wants to be found) and treat the gate as a brand moment, not security. If real gating is ever wanted, it must move to middleware + cookie (T5) and SEO for case-study content is forfeit. `[AUTHOR INPUT NEEDED]` — confirm ceremonial-gate intent (App. B-9).

CRR: no sitemap entries, no metadata, no OG — enforced by the §19 grep.

---

## §11. Testing Strategy

Current state: zero tests, 6 pre-existing lint errors. Pragmatic pyramid for a solo-maintained portfolio:

1. **Phase 0:** fix T2, T3, T4 (lint reaches zero); add GitHub Actions workflow: `npm run lint` + `npm run build` on every PR.
2. **Playwright smoke suite** (Phase 0 skeleton, grows through phases):
   - Arrival gate: unlock with `SITE_PASSWORD`, enter site via keyboard path (guards A2 forever).
   - Home renders all five section ids; no console errors (guards T2-class bugs).
   - Every non-hidden project slug renders its title (loops `projects`).
   - Chat happy path with **mocked** OpenAI (intercept `/api/chat` upstream via route mock or msw) + error path (503 copy when key missing).
   - 404 for unknown slug; `/playground` renders (if kept).
3. **axe-core** (`@axe-core/playwright`) in the same run — zero critical/serious threshold (§8.3.4).
4. **Unit tests** only where logic lives: `/api/chat` validation (T6 cases), `/api/unlock` (missing env → 503, bad body → 400, wrong/right password). Vitest, no snapshot sprawl.
5. CI stays under ~5 min so it never gets disabled.

---

## §12. Shared Case Study Framework

The `Project` interface (§3.2) is 80% sufficient. Extensions (interface diff, executed Phase 5):

```ts
export interface Project {
  // ...existing fields...
  /** Client/employer display line, e.g. "Oxford Analytica · via Wizeline & Dow Jones" */
  client?: string;
  /** Shown as an NDA notice banner on the case study page */
  confidentialityNote?: string;
  /** Platform/domain chips, e.g. ["Web platform", "Enterprise SaaS"] */
  platform?: string[];
}

export interface CaseStudySection {
  // ...existing fields...
  /** Render style: default prose, or specialized blocks */
  variant?: "prose" | "gallery" | "beforeAfter" | "metricsRow";
  /** For gallery/beforeAfter: multiple images with alts */
  images?: { src: string; alt: string; caption?: string }[];
}

export interface ImpactMetric {
  label: string;
  value: string;
  /** e.g. "internal measure, directional" — rendered as a footnote */
  caveat?: string;
}
```

**New components** (`components/work/`): `CaseStudyNdaNotice` (quiet banner: "Details generalized to respect confidentiality; visuals are recreations"), `CaseStudyGallery` (grid of anonymized artifacts), `CaseStudyBeforeAfter` (two-up comparison), metrics row rendering `caveat` footnotes. All compose into the existing `/work/[slug]` renderer — no route changes.

**Validation:** Phase 5 retrofits `my3-case-study` to the extended framework (it already needs D3's image fixes) before OA/GRM content lands on it.

**Authoring workflow:** extend `CONTENT_EDIT_GUIDE.md` with the new fields, image conventions (`public/images/projects/<slug>/`, alt-text required, no production screenshots without clearance), and the three-tier confidentiality rule (§15).

---

## §13. Oxford Analytica Case Study Plan

**Current state:** OA exists only as a marquee logo (`content/siteData.ts:158`). Nothing may be invented; the skeleton below is structure, and every substantive slot is author input.

**Proposed narrative skeleton** (maps to framework fields):

1. **Hero** — title, tagline, `client`, `confidentialityNote`, role/team/tools, timeframe
2. **Context** — what OA is (public knowledge OK: geopolitical analysis and advisory firm), what the engagement was
3. **Problem** — why migration/modernization was needed
4. **Process sections** (each a `CaseStudySection`; the brief names these areas): migration work · platform integration · settings · search · sectors · international · books · events · UAT · QA · collaboration
5. **Impact** — metrics with caveats, or qualitative outcomes if nothing is cleared
6. **Reflection**

**Intake questionnaire** `[AUTHOR INPUT NEEDED]` (App. B-10) — answer in one sitting; every answer feeds a skeleton slot:

1. What was your exact role and title on the OA engagement, and over what timeframe?
2. Who was the team (disciplines, not names), and who did you report to / collaborate with?
3. One sentence: what was the engagement's mission (the "migration work" — from what, to what)?
4. What was the platform being integrated with or migrated to? What can be named publicly?
5. For each area — settings, search, sectors, international, books, events — what did you personally design, and what's the one interesting problem in each?
6. What did UAT and QA involve, and what was your role in them?
7. What shipped? What is live today that you can point at (even if behind a login)?
8. Any metrics at all (adoption, time saved, satisfaction, delivery milestones)? For each: is it cleared, or must it be generalized?
9. What visuals exist — and what's their clearance status? (Production screenshots / your own Figma / nothing → we build anonymized recreations)
10. Is the client name "Oxford Analytica" cleared for public use in a portfolio? (It's on the marquee already — confirm that's intentional and extends to a case study)
11. What's the one thing about this engagement that makes it portfolio-lead material?
12. Anything explicitly off-limits?

**Confidentiality:** three-tier rule (§15) applies to every answer; the case study is drafted only from confirmed answers, reviewed against §15 before merge.

---

## §14. Global Risk Monitor (GRM) Case Study Plan

**Current state:** GRM appears nowhere in the codebase. Same skeleton discipline as §13.

**Proposed narrative skeleton:** Hero (with `confidentialityNote`) → Context (what GRM is, as clearable) → Problem → Process sections per the brief: risk visualisation · data visualisation · maps · tables · trends · phases · QA · stakeholder collaboration → Impact (caveated) → Reflection. Visual emphasis: this is the *data-viz showcase* of the portfolio — maps, tables, trend displays — rendered as anonymized recreations with representative (fake) data. §4 Option B's editorial/data-viz language is designed to make this page sing.

**CRR firewall (critical):** GRM and CRR are adjacent Dow Jones risk products. GRM prose is the likeliest place CRR details leak by implication. Rules: never contrast GRM with "another product"; never describe features by pointing at what a sibling product does; phase/roadmap descriptions must not reference other-product milestones. Draft review includes a specific "does any sentence describe or imply CRR?" pass (§15, §19).

**Intake questionnaire** `[AUTHOR INPUT NEEDED]` (App. B-11):

1. Role, title, timeframe on GRM?
2. Team composition and your position in it?
3. What is GRM, in one public-safe sentence? Is the product name cleared for portfolio use?
4. What risk-visualisation problems did you design for (the shape of the problem, not the data)?
5. Maps: what did they show, what was hard about them (projection, density, interaction)? What can be recreated with fake data?
6. Tables and trends: what made these design problems non-trivial?
7. "Phases" — what were the project phases, and what changed between them?
8. Your role in QA?
9. Stakeholder collaboration: who (roles), what cadence, what did you own?
10. Outcomes — anything measurable or citable, cleared or generalizable?
11. Visuals: what exists, what's cleared, what do we recreate?
12. Anything off-limits — and specifically, anything that borders CRR territory I should firewall?

---

## §15. Confidentiality Review

**Default stance:** OA and GRM are NDA-bound commercial engagements. The safe path is the easy path: content enters the case studies **only** through the §13/§14 intake answers.

**Three-tier content rule:**

| Tier | Content | Usable? |
|------|---------|---------|
| 1 | Publicly verifiable facts (company names as already public, public marketing descriptions) | Yes, with a check that naming is cleared (B-10 Q10, B-11 Q3) |
| 2 | Cormac's own role, process, and craft descriptions | Yes, once author-confirmed via intake |
| 3 | Internal data, real metrics, production UI, client names within the work, roadmaps | Never verbatim. Metrics generalized ("meaningfully reduced…") unless explicitly cleared (then tagged with `caveat`); visuals rebuilt as anonymized recreations made for the portfolio |

**Visuals rule:** no production screenshots without explicit written clearance; recreations use representative fake data and carry the `confidentialityNote`; file names and alt text must not leak internal terminology.

**Chatbot surface:** the system prompt ingests only final published case-study copy (§7.5); it must contain zero CRR content and decline confidential questions gracefully.

**CRR exclusion (restated as binding):** no routes, no navigation, no chatbot knowledge, no metadata, no public content relating to Country Risk Review anywhere in the site. GRM drafting follows the §14 firewall. Enforced by §19's repo-wide grep.

**Pre-publish checklist (per case study, Phase 6 gate):**

- [ ] Every fact traces to an intake answer or Tier-1 source
- [ ] Every metric is cleared or generalized + caveated
- [ ] Every visual is a recreation (or has written clearance)
- [ ] `grep -ri "CRR\|country risk" --include="*.ts" --include="*.tsx" --include="*.md" .` → only this document's exclusion statements
- [ ] Author sign-off recorded in the PR description

---

## §16. Git & Release Plan

Repo state: cloned from `github.com/cormacleespain-web/Portfolio2026`, branch `main`, remote `origin` configured, working tree clean (plus this document).

1. **Step zero:** commit this document to `main` (it's the plan of record), then `git checkout -b upgrade/portfolio-v2`.
2. **Branch strategy:** `upgrade/portfolio-v2` is the integration branch. Each roadmap phase = one PR **into** it (`v2/phase-0-safety-net`, `v2/phase-1-tokens`, …). Final PR: `upgrade/portfolio-v2` → `main` when §18 passes.
3. **PR size:** target ≤ ~400 changed lines each so a Claude Code or Cursor session maps ~1:1 to a PR; Phase 2 may split into `2a-a11y` / `2b-perf`.
4. **Commit style:** Conventional Commits (`fix:`, `feat:`, `refactor:`, `content:`).
5. **Verification per PR:** CI (lint + build + Playwright) green; Vercel preview link checked against the phase's acceptance criteria before merge.
6. **Rollback:** revert the phase PR; phases are ordered to keep `upgrade/portfolio-v2` shippable after every merge.
7. **Release:** merge to `main` → Vercel production. Confirm `SITE_PASSWORD` + `API_KEY` set in Vercel env before the Phase 3 PR merges (B-7).

---

## §17. Implementation Roadmap

Each phase = one PR. "Resolves" ties back to Appendix A.

### Phase 0 — Safety net
| Step | Files | Acceptance criteria |
|------|-------|---------------------|
| Fix duplicate key (T2) | `components/sections/Experiences.tsx` | Console clean on home |
| Fix lint errors (T3, T4) | `work/[slug]/page.tsx`, `CaseStudyHero.tsx`, `ChatWidget.tsx`, `SelectedWorks.tsx`, `useArrivalDismissed.ts`, `CaseStudyPinnedPanels.tsx` | `npm run lint` → 0 problems |
| CI workflow | `.github/workflows/ci.yml` | lint + build + Playwright on PR |
| Playwright + axe skeleton | `e2e/` | Gate-unlock, home-render, slug-render tests pass headless |
| Perf baseline | (measurements only) | Lighthouse + bundle table recorded in PR description |

**Depends on:** author decisions B-3 (design option) unblocked for Phase 1 during this phase. **Resolves:** T2, T3, T4.

### Phase 1 — Foundations & tokens
Design decision (B-3) executed as tokens: body font + type scale, `ring` token, accent consolidation, hero headline recolor, ChatWidget token adoption, light-theme delete-or-keep, dead-code removal (§3.4: components, Rocket, hidden stubs pending B-5, ThemeToggle pending the light-theme call). Before/after screenshots in PR. **Resolves:** D1, D2, D4, D6 (partial), A10, P5, C1 (hidden stubs). **Depends on:** Phase 0 (CI catches regressions).

### Phase 2 — Accessibility & performance
2a: ArrivalCover keyboard path + button + aria fix (A1, A2, A8); ChatWidget dialog semantics (A3, a11y half); reduced-motion for 3D/starfield (A4); marquee SR fix (A9); RotatingTitle removal (A5/T9).
2b: sphere lifecycle + dynamic import (P1, P2); AllWork curation/virtualization (A6/P3); dvh sweep (T8/P4); playground mobile fix or route cut per B-6 (T10). **Resolves:** A1–A6, A8, A9, P1–P4, T8, T9, T10. **Depends on:** Phase 1 (focus ring, palette for A7 re-measure).

### Phase 3 — Chatbot recovery
Real key in envs (B-7); error differentiation + logging (T1); input validation (T6); client error copy; widget polish on the Phase-2 a11y base; system-prompt confidentiality instruction (§7.5). **Acceptance:** live happy-path conversation on Vercel preview; unplugging the key yields the 503 copy, not a 500. **Resolves:** T1, T6.

### Phase 4 — SEO
metadataBase/canonical/title template (B-8), per-page metadata, `sitemap.ts`, `robots.ts`, `next/og` images, JSON-LD, gate-intent documented (B-9, T5, T7 disposition). **Acceptance:** valid OG preview in a card debugger; sitemap lists exactly the visible slugs; Rich Results test passes Person + CreativeWork. **Resolves:** T5 (decision), T7, S1–S8.

### Phase 5 — Case study framework
Interface extensions + new components (§12); retrofit `my3-case-study` (fills D3 image voids with real or recreated assets; fixes C2 placeholder metric); `CONTENT_EDIT_GUIDE.md` update; decide stub-project fate (B-5). **Acceptance:** MyThree renders on the extended framework with zero empty image blocks. **Resolves:** D3, C2, F1–F4.

### Phase 6 — OA & GRM content *(gated on B-10, B-11 complete + §15 sign-off)*
Author OA + GRM entries in `content/projects.ts` from intake answers; anonymized visual recreations into `public/images/projects/{oa,grm}/`; `nextProject` chain rewire; sitemap/OG/chat knowledge follow automatically from Phases 3–5 infra; §15 pre-publish checklist in PR. **Resolves:** the portfolio-positioning core of the brief.

### Phase 7 — Polish & release
Motion spec application (§6) + `AGENTS.md` motion-lanes note; full §8.3 manual protocol; Lighthouse vs §9.3 budgets; §19 checklist run; final PR `upgrade/portfolio-v2` → `main`. **Resolves:** A7 (verified), D6 (verified), remaining P2s.

---

## §18. Definition of Done

- [ ] `npm run lint` → 0 errors, 0 warnings; `npm run build` clean
- [ ] CI green on the final PR; Playwright + axe suites pass
- [ ] Keyboard-only user can unlock the gate, enter the site, reach all content, and use the chat — no traps
- [ ] axe: zero critical/serious on every route
- [ ] `prefers-reduced-motion` honored by every animation, including 3D and starfield
- [ ] Chatbot answers on production; with the key removed it degrades to a friendly 503, never a blank 500
- [ ] Lighthouse budgets (§9.3) met on home + one case study, production build
- [ ] `sitemap.xml`, `robots.txt`, OG images, and JSON-LD present and validating
- [ ] MyThree renders on the extended framework with no empty image voids
- [ ] OA and GRM case studies live, each with recorded author confidentiality sign-off
- [ ] `grep -ri "CRR\|country risk"` across the repo → matches only this document's exclusion statements
- [ ] Appendix B register fully resolved (no open `[AUTHOR INPUT NEEDED]`)
- [ ] No placeholder copy ("Add your…", "Edit in content/…", `+↑`) reachable on any public URL

## §19. Final Verification Checklist

Run top-to-bottom on the final `upgrade/portfolio-v2` → `main` PR. Each item is an assertion.

**Automated**
1. `npm run lint` exits 0 with zero problems
2. `npm run build` exits 0
3. `npx playwright test` exits 0 (includes axe checks)
4. `grep -rin "crr\|country risk" --include="*.ts" --include="*.tsx" --include="*.json" app components content lib hooks public` returns nothing
5. `grep -rn "Add your\|Edit in content\|placeholder.svg" content/` returns nothing reachable from a visible project
6. `curl -s <preview>/sitemap.xml` lists home + exactly the visible project slugs
7. `curl -s <preview>/robots.txt` references the sitemap

**Manual**
8. Vercel env: `SITE_PASSWORD` and `API_KEY` present in production scope
9. Keyboard-only: full journey per §8.3.1 completes
10. VoiceOver: gate is perceivable, passable; a chat reply is announced exactly once
11. OS reduced-motion on: sphere static, no starfield twinkle, gate passable via button
12. Chat: one real conversation on the production preview; then confirm the 503 path by testing with the key absent locally
13. OG: paste home + one case study URL into a card debugger — correct image, title, description
14. Lighthouse (mobile, production): budgets §9.3 met on `/` and one case study
15. OA + GRM pages: read against §15 pre-publish checklist; author sign-off comment on the PR
16. Every Appendix B row shows **Resolved**

---

## Appendix A — Finding Index

| ID | Section | Description (short) | Phase |
|----|---------|---------------------|-------|
| T1 | §3.3/§7 | Chat: empty catch masks 401 as 500 | 3 |
| T2 | §3.3 | Duplicate React key in Experiences | 0 |
| T3 | §3.3 | Raw `<a>` page links (lint) | 0 |
| T4 | §3.3 | setState-in-effect (lint) ×3 + deps warning | 0 |
| T5 | §3.3 | Gate is cosmetic; no server enforcement | 4 (decision) |
| T6 | §3.3/§7.3 | Chat input unvalidated | 3 |
| T7 | §3.3 | Non-constant-time password compare | 4 |
| T8 | §3.3 | 100vh vs dvh | 2 |
| T9 | §3.3 | RotatingTitle title churn | 2 |
| T10 | §5.3 | Playground mobile: 0-height main, black void | 2 |
| D1 | §4.1 | Accent sprawl (5 families) | 1 |
| D2 | §4.1 | No body typeface token | 1 |
| D3 | §4.1/§5.2 | Empty image voids in case studies | 5 |
| D4 | §4.1 | Undefined ring token | 1 |
| D5 | §4.1 | Gradient CTA contrast (=A7) | 1→7 |
| D6 | §4.1 | Three clashing visual temperatures | 1, 7 |
| A1 | §8.1 | aria-hidden wraps focusable input | 2 |
| A2 | §8.1 | Gate keyboard trap | 2 |
| A3 | §8.1 | ChatWidget dialog semantics/live region | 2 (+3 polish) |
| A4 | §8.1 | 3D/starfield ignore reduced motion | 2 |
| A5 | §8.1 | Title churn (=T9) | 2 |
| A6 | §8.1 | 407 focusable carousel links | 2 |
| A7 | §8.1 | CTA contrast 3.4:1 | 1→7 |
| A8 | §8.1 | Gate input focus style invisible | 2 |
| A9 | §8.1 | Marquee SR duplication | 2 |
| A10 | §8.1 | Blue default focus ring | 1 |
| P1 | §9.2 | Sphere always animating | 2 |
| P2 | §9.2 | three.js in first-load JS | 2 |
| P3 | §9.2 | Home DOM weight (4,524 nodes) | 2 |
| P4 | §9.2 | dvh sweep (=T8) | 2 |
| P5 | §9.2 | Dead code in bundle | 1 |
| P6 | §9.2 | Font loading after redesign | 1, 7 |
| S1–S8 | §10 | metadataBase/metadata/sitemap/robots/OG/JSON-LD/title-fix/gate-decision | 4 |
| F1–F4 | §12 | Interface extensions / NDA notice / gallery+beforeAfter / guide update | 5 |
| C1 | §5.2 | Stub case studies on live URLs | 1 (hide) / 5 (decide) |
| C2 | §5.2 | Placeholder metric `+↑` presented as data | 5 |

## Appendix B — Author Input Register

| # | Question | Feeds | Status |
|---|----------|-------|--------|
| B-1 | Do real testimonials/awards exist to publish, or delete those sections? | §3.4, Phase 1 | Open |
| B-2 | Is the `mcp.json` html.to.design instance URL safe to keep in a public repo? | §3.4 | Open |
| B-3 | Design direction: Option A (refine) or Option B (editorial reset — recommended)? | §4.2, Phase 1 | Open |
| B-4 | Hero employer marks: keep favicons or switch to monochrome wordmarks? | §5.1, Phase 1 | Open |
| B-5 | Which of crewpay / grad-cap / fitprint / helping-hand to complete vs delete? | §5.2, Phase 5 | Open |
| B-6 | `/playground`: keep (and link it) or cut for v2? | §5.3, Phase 2 | Open |
| B-7 | Provision real OpenAI API key (local `.env.local` + Vercel production) | §7.1, Phase 3 | Open |
| B-8 | Canonical production domain + site description line | §10.1, Phase 4 | Open |
| B-9 | Confirm the gate stays ceremonial (content indexable) | §10.8, Phase 4 | Open |
| B-10 | Oxford Analytica intake questionnaire (§13, 12 questions) | Phase 6 gate | Open |
| B-11 | GRM intake questionnaire (§14, 12 questions) | Phase 6 gate | Open |

---

*End of UpgradePortfolio-v2.md*
