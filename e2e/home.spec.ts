import { test, expect } from "@playwright/test";
import { bypassArrivalGate } from "./helpers";

const SECTION_IDS = [
  "hero",
  "selected-works",
  "experience",
  "all-work",
  "people-worked-with",
];

test("home renders all five sections with no console errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await bypassArrivalGate(page);
  await page.goto("/");

  for (const id of SECTION_IDS) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }

  expect(consoleErrors, `console errors:\n${consoleErrors.join("\n")}`).toEqual([]);
});
