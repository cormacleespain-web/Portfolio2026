import { test, expect } from "@playwright/test";

const SITE_PASSWORD = process.env.SITE_PASSWORD ?? "ci-placeholder-password";

test.describe("Arrival gate", () => {
  test("unlocks with the correct password via keyboard", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Site password");
    await expect(input).toBeVisible();
    await input.fill(SITE_PASSWORD);
    await input.press("Enter");

    await expect
      .poll(async () => page.evaluate(() => sessionStorage.getItem("portfolio-site-unlocked")))
      .toBe("1");
  });

  test("rejects the wrong password with a visible error", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Site password");
    await input.fill("definitely-wrong");
    await input.press("Enter");

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("step 2 can be dismissed via keyboard (A2)", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Site password").fill(SITE_PASSWORD);
    await page.getByLabel("Site password").press("Enter");

    const enterButton = page.getByRole("button", { name: "Enter site" });
    await expect(enterButton).toBeVisible();
    await page.keyboard.press("Enter");

    await expect
      .poll(async () => page.evaluate(() => sessionStorage.getItem("portfolio-arrival-dismissed")))
      .toBe("1");
  });

  test("step 2 can be dismissed via the visible Enter site button", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Site password").fill(SITE_PASSWORD);
    await page.getByLabel("Site password").press("Enter");

    const enterButton = page.getByRole("button", { name: "Enter site" });
    await expect(enterButton).toBeVisible();
    await enterButton.click();

    await expect
      .poll(async () => page.evaluate(() => sessionStorage.getItem("portfolio-arrival-dismissed")))
      .toBe("1");
  });
});
