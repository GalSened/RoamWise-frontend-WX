import { test, expect } from '@playwright/test';

test('Tab switch shows one page only', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#searchView')).toBeVisible();
  await page.getByTestId('nav-trip').click();
  await expect(page.locator('#tripView')).toBeVisible();
  await expect(page.locator('#searchView')).toBeHidden();
});

test('Content not hidden under fixed navbar', async ({ page }) => {
  await page.goto('/');
  const padTop = await page.evaluate(() => getComputedStyle(document.getElementById('appMain')!).paddingTop);
  expect(padTop).not.toBe('0px');
});
