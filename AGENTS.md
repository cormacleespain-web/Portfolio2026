# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js 16** (Turbopack) portfolio site — a single application with no database, no Docker, and no external services.

### Running the app

- `npm run dev` starts the dev server on port 3000 (Turbopack by default).
- `npm run dev:webpack` uses Webpack instead of Turbopack if needed.
- The site has a gated onboarding screen. The site credential env var must be set in `.env.local` to enable the `/api/unlock` endpoint; without it the unlock API returns 503 but the rest of the site renders normally. See `app/api/unlock/route.ts` for the env var name.

### Lint / Build / Test

- `npm run lint` — ESLint (flat config in `eslint.config.mjs`). There are pre-existing lint errors (e.g. `@next/next/no-html-link-for-pages`, `react-hooks/set-state-in-effect`); these are in the repo, not introduced by agents.
- `npm run build` — production build. No automated test suite exists in this repo.
- TypeScript checking is done as part of the build step.

### Gotchas

- If `npm run dev` picks a different port (e.g. 3001), a stale `.next/dev/lock` file or leftover Next.js process may be occupying port 3000. Remove the lock file (`rm -f .next/dev/lock`) and kill the old process before restarting.
- Image quality warnings ("quality 95 not configured") are expected and harmless — they come from `next/image` usage in the codebase.
- Content is entirely in-repo TypeScript files under `content/` (see `CONTENT_EDIT_GUIDE.md`). No CMS or API integration.
