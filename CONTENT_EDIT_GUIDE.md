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

---

## Images

- **Folder:** `public/images/` (see `public/images/README.md`).
- **Placeholder:** `public/images/placeholder.svg` is used when a project has `image: "/images/placeholder.svg"`.
- **Project images:** Add files under `public/images/projects/<slug>/` (e.g. `cover.jpg`) and set `image: "/images/projects/my3-case-study/cover.jpg"` in `content/projects.ts`.

---

## Summary

- **Home page sections (except works):** `content/siteData.ts`
- **Selected Works + case study content + project images:** `content/projects.ts` and `public/images/`

Content was gathered from imcormaclee.me; fill in timeframes, experiences, education, and contact links as needed.
