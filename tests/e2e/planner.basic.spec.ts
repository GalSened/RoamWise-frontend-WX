import { test, expect } from '@playwright/test';

test('NEARBY from current location renders timeline', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('nav-trip').click();
  await page.locator('#btnStartCurrent').click();
  await page.locator('#nearRadius').fill('5');
  await page.locator('#detourMin').fill('12');
  await page.locator('#btnPlanDay').click();
  await expect(page.locator('#planner-results .poi').first()).toBeVisible({ timeout: 30000 });
});
