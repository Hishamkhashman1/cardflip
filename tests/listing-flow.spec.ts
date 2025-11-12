import { test, expect } from "@playwright/test";

test("homepage renders catalog", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Trade original creature cards")).toBeVisible();
  await expect(page.getByPlaceholder("Search title or set")).toBeVisible();
});
