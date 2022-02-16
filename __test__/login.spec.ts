import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/account/login");
  await page.fill('input[name="username"]', "UnusualAbsurdDev");
  await page.fill('input[name="password"]', "1200");
  await page.click("text=Login");

  setTimeout(async () => {
    await expect(page).toHaveURL("/");
  }, 1500);
});

test("first", async ({ page }) => {
  await page.goto("/");
  await page.reload();
  await expect(page).toHaveTitle("Home | Unusual Blogs");
});
