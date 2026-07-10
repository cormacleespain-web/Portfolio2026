import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { bypassArrivalGate } from "./helpers";
import { projects } from "../content/projects";

test("home has zero critical/serious axe violations", async ({ page }) => {
  await bypassArrivalGate(page);
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  const seriousOrWorse = results.violations.filter((v) =>
    ["critical", "serious"].includes(v.impact ?? ""),
  );
  expect(seriousOrWorse).toEqual([]);
});

const visibleProjects = projects.filter((p) => !p.hidden);

for (const project of visibleProjects) {
  test(`/work/${project.slug} has zero critical/serious axe violations`, async ({ page }) => {
    await bypassArrivalGate(page);
    await page.goto(`/work/${project.slug}`);
    // CaseStudyHero and ScrollReveal-wrapped sections fade in from opacity 0
    // on mount/in-view via ancestor motion.div elements (not the text nodes
    // themselves, so waiting on a specific element's computed opacity
    // doesn't reliably reflect it). Scanning mid-transition reports
    // false-positive contrast failures against the blended, near-invisible
    // color — wait for entrance animations to settle instead.
    await page.waitForTimeout(1500);
    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrWorse = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(seriousOrWorse).toEqual([]);
  });
}
