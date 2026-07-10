import { test, expect } from "@playwright/test";
import { bypassArrivalGate } from "./helpers";

test.describe("ChatWidget", () => {
  test("shows friendly unavailable copy, never a raw 500, when the upstream key is invalid", async ({
    page,
  }) => {
    await bypassArrivalGate(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Chat with AI assistant" }).click();
    const dialog = page.getByRole("dialog", { name: "Cormac's Portfolio Bot chat" });
    await expect(dialog).toBeVisible();

    await page.getByPlaceholder("Ask about Cormac's work...").fill("What projects has Cormac worked on?");
    await page.getByPlaceholder("Ask about Cormac's work...").press("Enter");

    // Scoped to a visible message bubble — the sr-only live region carries
    // the same text and would otherwise make this locator ambiguous.
    await expect(dialog.locator("p", { hasText: /temporarily unavailable/i })).toBeVisible();
    await expect(dialog.getByText(/internal server error/i)).toHaveCount(0);
  });

  test("Escape closes the panel and returns focus to the FAB", async ({ page }) => {
    await bypassArrivalGate(page);
    await page.goto("/");

    const fab = page.getByRole("button", { name: "Chat with AI assistant" });
    await fab.click();
    await expect(page.getByRole("dialog", { name: "Cormac's Portfolio Bot chat" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Cormac's Portfolio Bot chat" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Chat with AI assistant" })).toBeFocused();
  });
});
