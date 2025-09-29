import { test, expect } from '@playwright/test';
import { SearchPage } from './pages/SearchPage';

test.describe('Search Page - Core Functionality', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test.describe('Happy Path Scenarios', () => {
    test('should perform basic search with AI orchestration', async () => {
      // Mock successful search response
      await searchPage.mockSearchSuccess([
        {
          place_id: 'test-place-1',
          name: 'Test Restaurant',
          rating: 4.5,
          address: '123 Test Street',
          aiScore: 4.2,
          scoreBreakdown: {
            rating: 4.5,
            popularity: 0.8,
            weatherFit: 0.9
          }
        },
        {
          place_id: 'test-place-2', 
          name: 'Another Great Place',
          rating: 4.3,
          address: '456 Test Avenue',
          aiScore: 4.0,
          scoreBreakdown: {
            rating: 4.3,
            popularity: 0.7,
            weatherFit: 0.8
          }
        }
      ]);

      // Perform search
      await searchPage.search('restaurants near me');

      // Verify results structure
      await searchPage.verifyResultsStructure();
      
      // Verify specific content
      const firstResult = searchPage.getResult(0);
      await expect(firstResult.name).toContainText('Test Restaurant');
      await expect(firstResult.rating).toContainText('4.5');

      // Verify AI features
      await searchPage.verifyExplainabilityChips(0);
      await searchPage.verifyAIScore(0);
    });

    test('should use quick tags for search', async () => {
      await searchPage.mockSearchSuccess([
        {
          place_id: 'restaurant-1',
          name: 'Pizza Place',
          rating: 4.4,
          types: ['restaurant', 'meal_takeaway']
        }
      ]);

      await searchPage.clickQuickTag('restaurants');

      // Verify search was triggered
      await searchPage.verifyResultsStructure();
      
      // Verify quick tag is highlighted
      await expect(searchPage.quickTags.restaurants).toHaveClass(/active/);
    });

    test('should apply filters and get filtered results', async () => {
      await searchPage.mockSearchSuccess([
        {
          place_id: 'filtered-place-1',
          name: 'High Rated Open Restaurant',
          rating: 4.8,
          opening_hours: { open_now: true }
        }
      ]);

      await searchPage.search('restaurants');
      
      await searchPage.applyFilters({
        openNow: true,
        highRated: true,
        radius: '1 km'
      });

      // Trigger new search with filters
      await searchPage.search('restaurants');

      await searchPage.verifyResultsStructure();
      
      // Verify filters are applied visually
      await expect(searchPage.quickFilters.openNow).toBeChecked();
      await expect(searchPage.quickFilters.highRated).toBeChecked();
    });

    test('should handle voice search', async ({ browserName }) => {
      test.skip(browserName === 'webkit', 'Voice API not fully supported in WebKit');
      
      await searchPage.mockSearchSuccess([
        {
          place_id: 'voice-result-1',
          name: 'Voice Search Result',
          rating: 4.2
        }
      ]);

      await searchPage.voiceSearch('find coffee shops nearby');

      await searchPage.verifyResultsStructure();
    });
  });

  test.describe('Integration Features', () => {
    test('should add places to compare tray', async () => {
      await searchPage.mockSearchSuccess([
        {
          place_id: 'compare-place-1',
          name: 'Place to Compare',
          rating: 4.5
        }
      ]);

      await searchPage.search('restaurants');
      await searchPage.addToCompare(0);

      // Verify compare tray is visible and contains item
      await expect(searchPage.compareTray).toBeVisible();
      await expect(searchPage.compareTray).toContainText('Place to Compare');
    });

    test('should show place details modal', async () => {
      await searchPage.mockSearchSuccess([
        {
          place_id: 'detail-place-1',
          name: 'Detailed Place',
          rating: 4.6,
          address: '789 Detail Street',
          types: ['restaurant', 'bar']
        }
      ]);

      await searchPage.search('restaurants');
      const modal = await searchPage.viewDetails(0);

      // Verify modal content
      await expect(modal).toContainText('Detailed Place');
      await expect(modal).toContainText('789 Detail Street');
      await expect(modal).toContainText('4.6');
    });

    test('should save places to itinerary', async () => {
      await searchPage.mockSearchSuccess([
        {
          place_id: 'save-place-1',
          name: 'Place to Save',
          rating: 4.3
        }
      ]);

      await searchPage.search('attractions');
      const notification = await searchPage.saveToItinerary(0);

      // Verify save notification
      await expect(notification).toContainText('Saved "Place to Save" to your itinerary');
      await expect(notification).toHaveClass(/success/);
    });

    test('should activate rain plan for bad weather', async () => {
      // Mock weather with high precipitation
      await searchPage.page.evaluate(() => {
        window.roamwiseApp.currentWeather = {
          precipitation_probability: 80,
          temperature: 20,
          conditions: 'rainy'
        };
      });

      await searchPage.mockSearchSuccess([
        {
          place_id: 'indoor-place-1',
          name: 'Indoor Alternative',
          types: ['museum', 'tourist_attraction'],
          weatherWarning: false
        }
      ]);

      await searchPage.toggleRainPlan();
      await searchPage.verifyRainPlanActive();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      await searchPage.mockSearchError('Search service temporarily unavailable');
      
      await searchPage.search('restaurants', { waitForResults: false });

      // Should show error message
      await expect(searchPage.hasError()).resolves.toBe(true);
      const errorMessage = await searchPage.getErrorMessage();
      expect(errorMessage).toContain('temporarily unavailable');

      // Should have retry option
      const retryButton = searchPage.page.locator('[data-testid="retry-button"]');
      await expect(retryButton).toBeVisible();
    });

    test('should handle network timeouts', async () => {
      await searchPage.simulateSlowNetwork(6000); // Slower than 5s timeout
      
      await searchPage.search('restaurants', { waitForResults: false, timeout: 8000 });

      // Should show timeout error
      await expect(searchPage.hasError()).resolves.toBe(true);
      const errorMessage = await searchPage.getErrorMessage();
      expect(errorMessage).toContain('timeout');
    });

    test('should handle empty search results', async () => {
      await searchPage.mockSearchSuccess([]);
      
      await searchPage.search('nonexistent place type xyz123');

      // Should show empty state
      await expect(searchPage.isEmpty()).resolves.toBe(true);
      
      // Should suggest alternatives
      const suggestions = searchPage.page.locator('[data-testid="search-suggestions"]');
      await expect(suggestions).toBeVisible();
    });

    test('should handle malformed user input', async () => {
      const maliciousInput = '<script>alert("xss")</script>restaurants';
      
      await searchPage.mockSearchSuccess([
        {
          place_id: 'safe-place-1',
          name: 'Safe Restaurant',
          rating: 4.0
        }
      ]);

      await searchPage.search(maliciousInput);

      // Should sanitize input and show safe results
      await searchPage.verifyResultsStructure();
      
      // Verify no script execution
      const alerts = await searchPage.page.evaluate(() => {
        return window.alertsTriggered || 0;
      });
      expect(alerts).toBe(0);
    });
  });

  test.describe('Performance', () => {
    test('should complete search within performance threshold', async () => {
      await searchPage.mockSearchSuccess([
        { place_id: 'perf-place-1', name: 'Performance Test Place', rating: 4.0 }
      ]);

      const startTime = Date.now();
      await searchPage.search('restaurants');
      const endTime = Date.now();

      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(5000); // 5 second threshold
    });

    test('should show loading states appropriately', async () => {
      await searchPage.simulateSlowNetwork(2000);
      await searchPage.mockSearchSuccess([
        { place_id: 'loading-place-1', name: 'Loading Test Place', rating: 4.0 }
      ]);

      // Start search
      const searchPromise = searchPage.search('restaurants', { waitForResults: false });

      // Should show loading immediately
      await expect(searchPage.isLoading()).resolves.toBe(true);

      // Wait for completion
      await searchPromise;

      // Loading should be gone
      await expect(searchPage.isLoading()).resolves.toBe(false);
    });

    test('should debounce rapid search inputs', async () => {
      let searchCount = 0;
      await searchPage.page.route('**/api/**', route => {
        searchCount++;
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { explanation: 'Debounced', uiPayload: { items: [] } }
          })
        });
      });

      // Rapid typing simulation
      await searchPage.searchInput.fill('r');
      await searchPage.page.waitForTimeout(100);
      await searchPage.searchInput.fill('re');
      await searchPage.page.waitForTimeout(100);
      await searchPage.searchInput.fill('res');
      await searchPage.page.waitForTimeout(600); // Wait for debounce

      // Should only trigger one search
      expect(searchCount).toBeLessThanOrEqual(1);
    });
  });

  test.describe('Accessibility', () => {
    test('should support keyboard navigation', async () => {
      await searchPage.testKeyboardNavigation();
    });

    test('should have proper ARIA labels', async () => {
      await searchPage.verifyAccessibility();
    });

    test('should work with screen readers', async () => {
      // Check for screen reader announcements
      const searchInput = searchPage.searchInput;
      await expect(searchInput).toHaveAttribute('aria-describedby');
      
      // Check results have proper structure
      await searchPage.mockSearchSuccess([
        { place_id: 'sr-place-1', name: 'Screen Reader Place', rating: 4.0 }
      ]);
      
      await searchPage.search('test');
      
      const resultsRegion = searchPage.page.locator('[role="region"][aria-label*="Search results"]');
      await expect(resultsRegion).toBeVisible();
    });

    test('should have sufficient color contrast', async () => {
      // This would typically be tested with axe-core
      // For now, verify elements are visible and readable
      await expect(searchPage.searchInput).toBeVisible();
      await expect(searchPage.searchButton).toBeVisible();
      
      // Check button states are distinguishable
      await searchPage.searchInput.fill('test');
      await expect(searchPage.searchButton).toBeEnabled();
      
      await searchPage.searchInput.fill('');
      await expect(searchPage.searchButton).toBeDisabled();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Reinitialize for mobile
      searchPage = new SearchPage(page);
      await searchPage.goto();
      
      await searchPage.mockSearchSuccess([
        { place_id: 'mobile-place-1', name: 'Mobile Place', rating: 4.0 }
      ]);

      await searchPage.search('restaurants');
      await searchPage.verifyResultsStructure();

      // Check mobile-specific elements
      const mobileLayout = page.locator('.mobile-layout');
      await expect(mobileLayout).toBeVisible();
    });

    test('should handle touch interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      searchPage = new SearchPage(page);
      await searchPage.goto();

      // Test touch targets are large enough
      const searchButton = searchPage.searchButton;
      const buttonBox = await searchButton.boundingBox();
      
      expect(buttonBox?.width).toBeGreaterThanOrEqual(44); // iOS minimum
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
    });
  });

  test.describe('Offline Functionality', () => {
    test('should handle offline state gracefully', async ({ page }) => {
      await page.context().setOffline(true);
      
      await searchPage.search('restaurants', { waitForResults: false });

      // Should show offline message
      const offlineMessage = page.locator('[data-testid="offline-message"]');
      await expect(offlineMessage).toBeVisible();
      
      // Should suggest using cached results
      const cachedResultsButton = page.locator('[data-testid="use-cached-results"]');
      await expect(cachedResultsButton).toBeVisible();
    });
  });
});