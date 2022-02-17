import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/account/login");
  await page.fill('input[name="username"]', "UnusualAbsurdDev");
  await page.fill('input[name="password"]', "1200");
  await page.click("text=Login");
});

test("login landing", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Home | Unusual Blogs");
});
