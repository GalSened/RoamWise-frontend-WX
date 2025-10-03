import { test, expect } from '@playwright/test';

test.describe('Traveling App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the app title', async ({ page }) => {
    await expect(page).toHaveTitle(/traveling/);
  });

  test('should have working navigation', async ({ page }) => {
    // Check initial view is search
    await expect(page.locator('#searchView')).toBeVisible();

    // Navigate to trip planning
    await page.getByTestId('nav-trip').click();
    await expect(page.locator('#tripView')).toBeVisible();

    // Navigate to AI
    await page.getByTestId('nav-ai').click();
    await expect(page.locator('#aiView')).toBeVisible();

    // Navigate to profile
    await page.getByTestId('nav-profile').click();
    await expect(page.locator('#profileView')).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    const themeToggle = page.locator('#themeToggle');
    
    // Initial theme should be light
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    
    // Toggle to dark
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    
    // Toggle back to light
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('should perform search', async ({ page }) => {
    // Navigate to search view
    await page.getByTestId('nav-search').click();

    // Enter search query
    await page.fill('#freeText', 'restaurants');
    await page.click('#searchBtn');

    // Should show loading state
    await expect(page.locator('#searchBtn')).toContainText('Searching');

    // Results should appear (mocked)
    await page.waitForTimeout(1000);
    await expect(page.locator('#list')).not.toBeEmpty();
  });

  test('should create trip plan', async ({ page }) => {
    // Navigate to trip planning
    await page.getByTestId('nav-trip').click();

    // Select duration
    await page.click('[data-duration="8"]');

    // Select interests
    await page.click('[data-interest="food"]');
    await page.click('[data-interest="nature"]');

    // Set budget
    await page.fill('#budgetRange', '400');

    // Generate trip
    await page.click('#generateTripBtn');

    // Should show loading state
    await expect(page.locator('#generateTripBtn')).toContainText('Generating');

    // Trip should be generated
    await page.waitForTimeout(2000);
    await expect(page.locator('#enhancedTripDisplay')).not.toHaveAttribute('hidden');
  });

  test('should handle voice interaction', async ({ page }) => {
    // Mock permissions
    await page.context().grantPermissions(['microphone']);

    // Navigate to AI view
    await page.getByTestId('nav-ai').click();

    // Test voice button
    const voiceBtn = page.locator('#voiceBtn');

    // Should be present and enabled
    await expect(voiceBtn).toBeVisible();
    await expect(voiceBtn).toBeEnabled();

    // Click and hold simulation
    await voiceBtn.click();

    // Should show listening state
    await expect(page.locator('#voiceStatus')).toContainText('Listening');
  });

  test.skip('should display map', async ({ page }) => {
    // Note: Map view doesn't exist in current implementation
    // This test is skipped until map feature is added
  });

  test('should show update notification', async ({ page }) => {
    // Mock update available
    await page.evaluate(() => {
      // Simulate update available
      window.dispatchEvent(new CustomEvent('update-available', {
        detail: {
          available: true,
          current: '1.0.0',
          latest: '2.0.0'
        }
      }));
    });
    
    // Update notification should appear
    await expect(page.locator('#updateNotification')).not.toHaveClass(/hidden/);
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // App should still be functional
    await expect(page.locator('.bottom-nav')).toBeVisible();

    // Navigation should work on mobile
    await page.getByTestId('nav-trip').click();
    await expect(page.locator('#tripView')).toBeVisible();
  });

  test('should handle offline state', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true);

    // App should still load from cache
    await page.reload();

    // Bottom nav should still be visible (basic functionality)
    await expect(page.locator('.bottom-nav')).toBeVisible();
  });

  test('should save preferences', async ({ page }) => {
    // Change theme
    await page.click('#themeToggle');

    // Create a trip plan
    await page.getByTestId('nav-trip').click();
    await page.click('[data-duration="8"]');

    // Reload page
    await page.reload();

    // Theme should be preserved
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});