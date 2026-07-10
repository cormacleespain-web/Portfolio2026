# Where to edit content

All copy and data live under **`content/`**. Images go in **`public/images/`**.

---

## `content/siteData.ts`

| Section        | What to edit |
|----------------|--------------|
| **Hero**       | `siteData.hero` → `positioningLine`, `name`, `supportingText`, `ctaPrimary`, `ctaSecondary` |
| **Experiences**| `siteData.experiences` → array of `{ timeframe, title, company }` |
| **Achievements** | `siteData.achievements` → array of `{ year, title, context }` |
| **Education**  | `siteData.education` → array of `{ timeframe, degree, institution }` |
| **Testimonials** | `siteData.testimonials` → array of `{ quote, name, role, organisation }` |
| **Contact**    | `siteData.contact` → `heading`, `subheading`, `email`, `links[]` |

---

## `content/projects.ts`

| Section          | What to edit |
|------------------|--------------|
| **Selected Works** | `projects` array: each item has `slug`, `title`, `category`, `timeframe`, `readTime`, optional `tagline`, `description`, and optional `image` (path e.g. `/images/projects/my3/cover.jpg`). |
| **Case study page** (`/work/[slug]`) | Same file: `description` is the case study body; `image` is shown as the cover when set. |
| **Client / confidentiality / platform** | Optional `Project` fields — `client` (e.g. `"Oxford Analytica · via Wizeline & Dow Jones"`, shown under the title), `confidentialityNote` (renders an NDA notice banner via `CaseStudyNdaNotice`), `platform` (string array rendered as chips, e.g. `["Web platform", "Enterprise SaaS"]`). |
| **Impact metrics with a caveat** | `impact` entries are `{ label, value, caveat? }` (`ImpactMetric`) — set `caveat` (e.g. `"internal measure, directional"`) instead of presenting a generalized/uncertain number as if it were precise. Never fabricate a value — omit the metric entirely if nothing is confirmed (see confidentiality rule below). |
| **Section variants** | `CaseStudySection` entries take an optional `variant`: `"gallery"` or `"beforeAfter"` render `images: {src, alt, caption?}[]` via `CaseStudyGallery` / `CaseStudyBeforeAfter` instead of the single `image` field (beforeAfter expects exactly 2, in `[before, after]` order). `"metricsRow"` is reserved for future use — no matching data field exists yet, so section data with this dependency isn't currently plumbed through. Omitting `variant` (or `"prose"`) uses the original single-image behavior. |

### Confidentiality rule (NDA-bound engagements — e.g. Oxford Analytica, Global Risk Monitor)

Three-tier rule for anything from a commercial/NDA-bound engagement:

1. **Publicly verifiable facts** (company names already public, public marketing descriptions) — usable once naming is confirmed cleared.
2. **Your own role, process, and craft descriptions** — usable once you've confirmed them.
3. **Internal data, real metrics, production UI, internal roadmaps** — never verbatim. Generalize metrics (tag with `caveat` if you do cite a number) and rebuild visuals as anonymized recreations with representative (not real) data via `CaseStudyGallery`/`CaseStudyBeforeAfter` — never a real production screenshot without explicit written clearance. Add `confidentialityNote` to the project.

Country Risk Review (CRR) is excluded from this site entirely — no routes, content, or chatbot knowledge, in any project entry.

---

## Images

- **Folder:** `public/images/` (see `public/images/README.md`).
- **Placeholder:** `public/images/placeholder.svg` is used when a project has `image: "/images/placeholder.svg"`.
- **Project images:** Add files under `public/images/projects/<slug>/` (e.g. `cover.jpg`) and set `image: "/images/projects/my3-case-study/cover.jpg"` in `content/projects.ts`.
- **No image, no placeholder block:** if a section has no real `image`, the page renders no image block at all rather than an empty placeholder — don't add `imageAspect` to a section unless you're also adding a real `image`.

---

## Summary

- **Home page sections (except works):** `content/siteData.ts`
- **Selected Works + case study content + project images:** `content/projects.ts` and `public/images/`

Content was gathered from imcormaclee.me; fill in timeframes, experiences, education, and contact links as needed.
