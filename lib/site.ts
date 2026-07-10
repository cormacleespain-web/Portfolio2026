/**
 * Canonical site URL. Prefers an explicit NEXT_PUBLIC_SITE_URL (set this once
 * a custom domain is ready — e.g. https://imcormaclee.me) over Vercel's
 * auto-populated deployment URL, falling back to localhost for local dev.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE_NAME = "Cormac Lee";
export const SITE_DESCRIPTION =
  "Portfolio of Cormac Lee, a senior product designer evolving the products behind global decision-making — case studies, experience, and design work.";
