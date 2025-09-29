import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly voiceButton: Locator;
  readonly clearButton: Locator;
  readonly resultsContainer: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;
  readonly emptyState: Locator;
  readonly quickFilters: {
    openNow: Locator;
    highRated: Locator;
    radiusSelect: Locator;
  };
  readonly quickTags: {
    restaurants: Locator;
    pizza: Locator;
    attractions: Locator;
    museums: Locator;
  };
  readonly rainPlanToggle: Locator;
  readonly compareTray: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Primary search elements with stable selectors
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.searchButton = page.locator('[data-testid="search-button"]');
    this.voiceButton = page.locator('[data-testid="voice-button"]');
    this.clearButton = page.locator('[data-testid="clear-button"]');
    
    // Results and state elements
    this.resultsContainer = page.locator('[data-testid="results-container"]');
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.emptyState = page.locator('[data-testid="empty-state"]');
    
    // Quick filters
    this.quickFilters = {
      openNow: page.locator('[data-testid="filter-open-now"]'),
      highRated: page.locator('[data-testid="filter-high-rated"]'),
      radiusSelect: page.locator('[data-testid="radius-select"]')
    };
    
    // Quick tag buttons
    this.quickTags = {
      restaurants: page.locator('[data-testid="quick-tag-restaurants"]'),
      pizza: page.locator('[data-testid="quick-tag-pizza"]'),
      attractions: page.locator('[data-testid="quick-tag-attractions"]'),
      museums: page.locator('[data-testid="quick-tag-museums"]')
    };
    
    // Integration components
    this.rainPlanToggle = page.locator('[data-testid="rain-plan-toggle"]');
    this.compareTray = page.locator('[data-testid="compare-tray"]');
  }

  /**
   * Navigate to search page
   */
  async goto() {
    await this.page.goto('/');
    await this.page.click('[data-view="search"]');
    await expect(this.searchInput).toBeVisible();
  }

  /**
   * Perform a basic text search
   */
  async search(query: string, options: { 
    waitForResults?: boolean;
    timeout?: number;
  } = {}) {
    const { waitForResults = true, timeout = 10000 } = options;
    
    await this.searchInput.fill(query);
    await this.searchButton.click();
    
    if (waitForResults) {
      // Wait for either results or error state
      await Promise.race([
        this.resultsContainer.waitFor({ state: 'visible', timeout }),
        this.errorMessage.waitFor({ state: 'visible', timeout }),
        this.emptyState.waitFor({ state: 'visible', timeout })
      ]);
    }
  }

  /**
   * Perform voice search (mock implementation for testing)
   */
  async voiceSearch(query: string) {
    // Grant microphone permission
    await this.page.context().grantPermissions(['microphone']);
    
    // Click voice button
    await this.voiceButton.click();
    
    // Simulate voice input (in real implementation would use Speech API)
    await this.page.evaluate((text) => {
      // Mock speech recognition result
      const event = new CustomEvent('speechresult', {
        detail: { transcript: text }
      });
      window.dispatchEvent(event);
    }, query);
    
    // Wait for results
    await this.waitForSearchCompletion();
  }

  /**
   * Click a quick tag
   */
  async clickQuickTag(tag: keyof typeof this.quickTags) {
    await this.quickTags[tag].click();
    await this.waitForSearchCompletion();
  }

  /**
   * Apply search filters
   */
  async applyFilters(filters: {
    openNow?: boolean;
    highRated?: boolean;
    radius?: string;
  }) {
    if (filters.openNow !== undefined) {
      if (filters.openNow) {
        await this.quickFilters.openNow.check();
      } else {
        await this.quickFilters.openNow.uncheck();
      }
    }

    if (filters.highRated !== undefined) {
      if (filters.highRated) {
        await this.quickFilters.highRated.check();
      } else {
        await this.quickFilters.highRated.uncheck();
      }
    }

    if (filters.radius) {
      await this.quickFilters.radiusSelect.selectOption(filters.radius);
    }
  }

  /**
   * Wait for search to complete (success or error)
   */
  async waitForSearchCompletion(timeout = 10000) {
    await Promise.race([
      this.resultsContainer.waitFor({ state: 'visible', timeout }),
      this.errorMessage.waitFor({ state: 'visible', timeout }),
      this.emptyState.waitFor({ state: 'visible', timeout })
    ]);
  }

  /**
   * Get search results count
   */
  async getResultsCount(): Promise<number> {
    const results = await this.resultsContainer.locator('.result-item').count();
    return results;
  }

  /**
   * Get specific result by index
   */
  getResult(index: number) {
    const resultElement = this.resultsContainer.locator('.result-item').nth(index);
    
    return {
      element: resultElement,
      name: resultElement.locator('[data-testid="place-name"]'),
      rating: resultElement.locator('[data-testid="place-rating"]'),
      address: resultElement.locator('[data-testid="place-address"]'),
      explainabilityChips: resultElement.locator('[data-testid="explainability-chips"]'),
      aiScore: resultElement.locator('[data-testid="ai-score"]'),
      compareButton: resultElement.locator('[data-testid="compare-button"]'),
      detailsButton: resultElement.locator('[data-testid="details-button"]'),
      saveButton: resultElement.locator('[data-testid="save-button"]')
    };
  }

  /**
   * Add result to compare tray
   */
  async addToCompare(resultIndex: number) {
    const result = this.getResult(resultIndex);
    await result.compareButton.click();
    
    // Wait for compare tray to appear or update
    await expect(this.compareTray).toBeVisible();
  }

  /**
   * View place details
   */
  async viewDetails(resultIndex: number) {
    const result = this.getResult(resultIndex);
    await result.detailsButton.click();
    
    // Wait for modal to appear
    const modal = this.page.locator('[data-testid="place-modal"]');
    await expect(modal).toBeVisible();
    return modal;
  }

  /**
   * Save place to itinerary
   */
  async saveToItinerary(resultIndex: number) {
    const result = this.getResult(resultIndex);
    await result.saveButton.click();
    
    // Wait for notification
    const notification = this.page.locator('[data-testid="notification"]');
    await expect(notification).toBeVisible();
    return notification;
  }

  /**
   * Check if loading state is shown
   */
  async isLoading(): Promise<boolean> {
    return await this.loadingIndicator.isVisible();
  }

  /**
   * Check if error state is shown
   */
  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Check if empty state is shown
   */
  async isEmpty(): Promise<boolean> {
    return await this.emptyState.isVisible();
  }

  /**
   * Verify search results structure
   */
  async verifyResultsStructure() {
    const resultsCount = await this.getResultsCount();
    expect(resultsCount).toBeGreaterThan(0);

    // Check first result has required elements
    const firstResult = this.getResult(0);
    await expect(firstResult.name).toBeVisible();
    await expect(firstResult.rating).toBeVisible();
    await expect(firstResult.compareButton).toBeVisible();
    await expect(firstResult.detailsButton).toBeVisible();
    await expect(firstResult.saveButton).toBeVisible();
  }

  /**
   * Verify explainability chips are present
   */
  async verifyExplainabilityChips(resultIndex = 0) {
    const result = this.getResult(resultIndex);
    await expect(result.explainabilityChips).toBeVisible();
    
    // Check for at least one chip
    const chips = result.explainabilityChips.locator('.explainability-chip');
    const chipCount = await chips.count();
    expect(chipCount).toBeGreaterThan(0);
  }

  /**
   * Verify AI score is displayed
   */
  async verifyAIScore(resultIndex = 0) {
    const result = this.getResult(resultIndex);
    await expect(result.aiScore).toBeVisible();
    
    const scoreText = await result.aiScore.textContent();
    expect(scoreText).toMatch(/\d+\.\d+\/5\.0/); // Format: "4.2/5.0"
  }

  /**
   * Toggle rain plan
   */
  async toggleRainPlan() {
    await this.rainPlanToggle.click();
    
    // Wait for weather-based results update
    await this.page.waitForTimeout(1000);
  }

  /**
   * Verify rain plan is active
   */
  async verifyRainPlanActive() {
    await expect(this.rainPlanToggle).toHaveClass(/rain-plan-active/);
    
    // Check for indoor venue indicators
    const indoorIndicators = this.page.locator('[data-testid="indoor-indicator"]');
    const count = await indoorIndicators.count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Clear search
   */
  async clearSearch() {
    await this.clearButton.click();
    await expect(this.searchInput).toHaveValue('');
    await expect(this.resultsContainer).toBeHidden();
  }

  /**
   * Verify accessibility
   */
  async verifyAccessibility() {
    // Check ARIA labels
    await expect(this.searchInput).toHaveAttribute('aria-label');
    await expect(this.searchButton).toHaveAttribute('aria-label');
    
    // Check keyboard navigation
    await this.searchInput.focus();
    await this.page.keyboard.press('Tab');
    await expect(this.searchButton).toBeFocused();
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation() {
    // Start at search input
    await this.searchInput.focus();
    
    // Tab through filters
    await this.page.keyboard.press('Tab');
    await expect(this.quickFilters.openNow).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await expect(this.quickFilters.highRated).toBeFocused();
    
    // Test Enter key to trigger search
    await this.searchInput.focus();
    await this.searchInput.fill('test query');
    await this.page.keyboard.press('Enter');
    
    await this.waitForSearchCompletion();
  }

  /**
   * Simulate network error
   */
  async simulateNetworkError() {
    await this.page.route('**/api/**', route => {
      route.abort('failed');
    });
  }

  /**
   * Simulate slow network
   */
  async simulateSlowNetwork(delay = 5000) {
    await this.page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, delay));
      await route.continue();
    });
  }

  /**
   * Mock successful search response
   */
  async mockSearchSuccess(mockData: any[]) {
    await this.page.route('**/api/orchestrate', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            explanation: 'Found great places for you',
            uiPayload: {
              items: mockData
            },
            confidence: 0.9
          },
          requestId: 'test-req-123'
        })
      });
    });
  }

  /**
   * Mock API error response
   */
  async mockSearchError(errorMessage = 'Search temporarily unavailable') {
    await this.page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: errorMessage
        })
      });
    });
  }
}