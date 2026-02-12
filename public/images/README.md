# Images

Add your portfolio images here. Files in `public/` are served from the site root.

## Suggested structure

- **`/images/hero/`** – Hero or profile image (optional).
- **`/images/projects/<slug>/`** – Per-project assets, e.g.:
  - `cover.jpg` or `cover.png` – Card/case study cover
  - `01.jpg`, `02.jpg` – Inline case study images

## Placeholder

- **`placeholder.svg`** – Generic placeholder used when no image is set. Replace project images in your content (e.g. `content/projects.ts` or components) with paths like `/images/projects/my3-case-study/cover.jpg` when you have assets.

## Usage in the app

Reference images by path from root, e.g. `src="/images/projects/my3-case-study/cover.jpg"` or use the Next.js `Image` component with `src="/images/..."`.
