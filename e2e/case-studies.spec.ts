import { test, expect } from "@playwright/test";
import { bypassArrivalGate } from "./helpers";
import { projects } from "../content/projects";

const visibleProjects = projects.filter((p) => !p.hidden);

test.describe("Case study pages", () => {
  for (const project of visibleProjects) {
    test(`/work/${project.slug} renders its title`, async ({ page }) => {
      await bypassArrivalGate(page);
      await page.goto(`/work/${project.slug}`);
      await expect(page.getByRole("heading", { level: 1, name: project.title })).toBeVisible();
    });
  }

  test("unknown slug returns 404", async ({ page }) => {
    await bypassArrivalGate(page);
    const response = await page.goto("/work/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
