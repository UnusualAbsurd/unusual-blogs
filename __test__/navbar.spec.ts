import test, { expect } from "@playwright/test";

test("Expect navbar items to work", async ({ page }) => {
  await page.goto("/");
  await page.click('button[name="community blogs"]');
  await expect(page).toHaveURL("/blogs");

  await page.reload();
  await page.click('button[name="create a blog"]');
  await expect(page).toHaveURL("/signup");
});
