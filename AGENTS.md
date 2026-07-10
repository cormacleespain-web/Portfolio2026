# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js 16** (Turbopack) portfolio site — a single application with no database, no Docker, and no external services.

### Running the app

- `npm run dev` starts the dev server on port 3000 (Turbopack by default).
- `npm run dev:webpack` uses Webpack instead of Turbopack if needed.
- The site has a gated onboarding screen. The site credential env var must be set in `.env.local` to enable the `/api/unlock` endpoint; without it the unlock API returns 503 but the rest of the site renders normally. See `app/api/unlock/route.ts` for the env var name.

### Lint / Build / Test

- `npm run lint` — ESLint (flat config in `eslint.config.mjs`). Should be 0 errors / 0 warnings — if you see any, fix them as part of your change rather than leaving them.
- `npm run build` — production build.
- `npm run test:e2e` — Playwright (`e2e/`): arrival gate keyboard path, chat widget, case study pages, axe-core a11y scans (home + every visible case study), `/api/chat` validation. Should be green; the only intentionally-non-passing state is a `test.fixme` for step-2 gate dismissal via incremental scroll-key progress (only the "dismiss immediately" keyboard/button path is covered).
- TypeScript checking is done as part of the build step.

### Motion lanes

Two animation libraries are both in active use — assign work by lane, don't blur them:

- **GSAP + ScrollTrigger** (`lib/gsap.ts`) — scroll-linked choreography only: pinned/scrubbed sections (`CaseStudyPinnedPanels`), hide-on-scroll chrome (`FloatingNav`), the footer's elastic wave.
- **`motion`** (Framer's successor) — component enter/exit and gesture-driven animation: reveals, springs, drag sheets, hover/tap feedback.
- **No new CSS `@keyframes` for anything stateful.** CSS keyframes are for ambient/decorative loops only (glows, starfield, marquee) — always paired with a `prefers-reduced-motion` branch that sets `animation: none`, not just a shorter duration.
- Every animation — in any of the three lanes — must have a `prefers-reduced-motion` branch. The `CaseStudyPinnedPanels` matchMedia-driven static-stack fallback is the reference pattern to copy.

### Gotchas

- If `npm run dev` picks a different port (e.g. 3001), a stale `.next/dev/lock` file or leftover Next.js process may be occupying port 3000. Remove the lock file (`rm -f .next/dev/lock`) and kill the old process before restarting.
- Image quality warnings ("quality 95 not configured") are expected and harmless — they come from `next/image` usage in the codebase.
- Content is entirely in-repo TypeScript files under `content/` (see `CONTENT_EDIT_GUIDE.md`). No CMS or API integration.
