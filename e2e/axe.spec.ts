import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { bypassArrivalGate } from "./helpers";

// Known-failing until Phase 2 (A1, A2, A6, A10 in UpgradePortfolio-v2.md) and
// Phase 7 (full §8.3 pass). Marked test.fail so CI tracks it without blocking
// Phase 0 — flip to a plain `test` once §18's "zero critical/serious" line
// is genuinely met.
test.fail(
  "home has zero critical/serious axe violations",
  async ({ page }) => {
    await bypassArrivalGate(page);
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrWorse = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(seriousOrWorse).toEqual([]);
  },
);
