import type { Page } from "@playwright/test";

const UNLOCK_KEY = "portfolio-site-unlocked";
const ARRIVAL_DISMISSED_KEY = "portfolio-arrival-dismissed";

/**
 * Bypasses the arrival gate (password + scroll-to-enter cover) for tests that
 * exercise page content rather than the gate itself. The gate's own
 * keyboard/AT path is covered separately in arrival-gate.spec.ts.
 */
export async function bypassArrivalGate(page: Page) {
  await page.addInitScript(
    ({ unlockKey, dismissedKey }) => {
      window.sessionStorage.setItem(unlockKey, "1");
      window.sessionStorage.setItem(dismissedKey, "1");
    },
    { unlockKey: UNLOCK_KEY, dismissedKey: ARRIVAL_DISMISSED_KEY },
  );
}
