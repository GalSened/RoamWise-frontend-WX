import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the modules before importing
vi.mock('../../../src/ai-orchestrator.js', () => ({
  default: vi.fn().mockImplementation(() => ({
    orchestrate: vi.fn(),
    orchestrateWithTwoPassPlanning: vi.fn(),
    initialized: true
  }))
}));

vi.mock('../../../src/explainability-chips.js', () => ({
  default: vi.fn().mockImplementation(() => ({
    generateChips: vi.fn().mockReturnValue([]),
    renderChips: vi.fn().mockReturnValue(''),
    renderScoringExplanation: vi.fn().mockReturnValue(''),
    init: vi.fn()
  }))
}));

vi.mock('../../../src/compare-tray.js', () => ({
  default: vi.fn().mockImplementation(() => ({
    addToCompare: vi.fn().mockReturnValue(true),
    init: vi.fn()
  }))
}));

vi.mock('../../../src/rain-plan.js', () => ({
  default: vi.fn().mockImplementation(() => ({
    updateWeather: vi.fn(),
    init: vi.fn()
  }))
}));

describe('Search Page AI Orchestrator Integration', () => {
  let app: any;
  let mockAIOrchestrator: any;
  let mockExplainabilityChips: any;
  let mockCompareTray: any;

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup DOM
    document.body.innerHTML = `
      <div id="results"></div>
      <input id="freeText" />
      <button id="searchBtn">Search</button>
    `;

    // Import after mocking
    const { default: RoamWiseApp } = await import('../../../app.js');
    app = new RoamWiseApp();
    
    // Setup mock references
    mockAIOrchestrator = app.aiOrchestrator;
    mockExplainabilityChips = app.explainabilityChips;
    mockCompareTray = app.compareTray;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.resetAllMocks();
  });

  describe('Search Execution', () => {
    it('should execute search with AI orchestrator', async () => {
      // Arrange
      const searchQuery = 'restaurants near me';
      const mockResponse = {
        success: true,
        data: {
          explanation: 'Found great restaurants for you',
          uiPayload: {
            items: [
              {
                place_id: 'test-place-1',
                name: 'Test Restaurant',
                rating: 4.5,
                address: '123 Test St',
                aiScore: 4.2
              }
            ]
          },
          confidence: 0.9
        },
        requestId: 'test-req-123'
      };

      mockAIOrchestrator.orchestrate.mockResolvedValue(mockResponse);

      // Act
      const result = await app.processAIMessage(searchQuery);

      // Assert
      expect(mockAIOrchestrator.orchestrate).toHaveBeenCalledWith(
        searchQuery,
        expect.objectContaining({
          location: app.userLocation,
          preferences: expect.any(Object),
          conversationHistory: expect.any(Array),
          language: app.currentLanguage,
          weather: app.currentWeather
        })
      );
      expect(result).toBeDefined();
      expect(app.lastAIResponse).toBe(mockResponse);
    });

    it('should detect two-pass planning for complex queries', async () => {
      // Arrange
      const complexQuery = 'plan a full day exploring the city with lunch and museums';
      const mockResponse = { success: true, data: { explanation: 'Complex plan created' } };
      
      mockAIOrchestrator.orchestrateWithTwoPassPlanning.mockResolvedValue(mockResponse);
      
      // Mock the detection method
      app.shouldUseTwoPassPlanning = vi.fn().mockReturnValue(true);

      // Act
      await app.processAIMessage(complexQuery);

      // Assert
      expect(app.shouldUseTwoPassPlanning).toHaveBeenCalledWith(complexQuery, expect.any(Object));
      expect(mockAIOrchestrator.orchestrateWithTwoPassPlanning).toHaveBeenCalled();
      expect(mockAIOrchestrator.orchestrate).not.toHaveBeenCalled();
    });

    it('should fallback to direct API when orchestrator fails', async () => {
      // Arrange
      const searchQuery = 'test query';
      app.aiOrchestrator = null; // Simulate orchestrator unavailable

      // Mock the fallback method
      app.processDirectAPI = vi.fn().mockResolvedValue({
        text: 'Fallback response',
        actions: []
      });

      // Act
      const result = await app.processAIMessage(searchQuery);

      // Assert
      expect(app.processDirectAPI).toHaveBeenCalledWith(searchQuery, expect.any(Object));
      expect(result.text).toBe('Fallback response');
    });
  });

  describe('Search Input Handling', () => {
    it('should sanitize search input', () => {
      // Arrange
      const maliciousInput = '<script>alert("xss")</script>restaurants';
      const searchInput = document.getElementById('freeText') as HTMLInputElement;

      // Act
      searchInput.value = maliciousInput;
      const sanitized = app.sanitizeInput(maliciousInput);

      // Assert
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
      expect(sanitized).toBe('restaurants'); // Only safe content remains
    });

    it('should validate search query length', () => {
      // Arrange
      const tooLong = 'a'.repeat(1001); // Assume 1000 char limit
      const justRight = 'restaurants in downtown';
      const empty = '';

      // Act & Assert
      expect(app.validateSearchQuery(tooLong)).toBe(false);
      expect(app.validateSearchQuery(justRight)).toBe(true);
      expect(app.validateSearchQuery(empty)).toBe(false);
    });

    it('should debounce search input', async () => {
      // Arrange
      const searchInput = document.getElementById('freeText') as HTMLInputElement;
      const searchSpy = vi.spyOn(app, 'executeSearch');
      
      // Act
      searchInput.value = 'r';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.value = 're';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.value = 'res';
      searchInput.dispatchEvent(new Event('input'));

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 600));

      // Assert
      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(searchSpy).toHaveBeenCalledWith('res');
    });
  });

  describe('Result Rendering', () => {
    it('should render search results with explainability chips', () => {
      // Arrange
      const mockResults = [
        {
          place_id: 'test-1',
          name: 'Test Place',
          rating: 4.5,
          address: '123 Test St',
          aiScore: 4.2,
          scoreBreakdown: { rating: 4.5, popularity: 0.8 }
        }
      ];

      mockExplainabilityChips.generateChips.mockReturnValue([
        { type: 'high_rating', label: 'Highly Rated', icon: '⭐' }
      ]);
      mockExplainabilityChips.renderChips.mockReturnValue('<div class="chips">⭐ Highly Rated</div>');

      // Act
      app.displayResults(mockResults);

      // Assert
      expect(mockExplainabilityChips.generateChips).toHaveBeenCalledWith(
        mockResults[0],
        expect.objectContaining({
          weather: app.currentWeather,
          userPreferences: expect.any(Object),
          location: app.userLocation
        })
      );

      const resultsContainer = document.getElementById('results');
      expect(resultsContainer?.innerHTML).toContain('Test Place');
      expect(resultsContainer?.innerHTML).toContain('⭐ Highly Rated');
    });

    it('should render place action buttons', () => {
      // Arrange
      const mockResults = [
        {
          place_id: 'test-1',
          name: 'Test Place',
          rating: 4.5,
          address: '123 Test St'
        }
      ];

      // Act
      app.displayResults(mockResults);

      // Assert
      const resultsContainer = document.getElementById('results');
      expect(resultsContainer?.innerHTML).toContain('Compare');
      expect(resultsContainer?.innerHTML).toContain('Details');
      expect(resultsContainer?.innerHTML).toContain('Save');
      expect(resultsContainer?.innerHTML).toContain('onclick="window.app?.addToCompare(\'test-1\')"');
    });

    it('should handle empty search results', () => {
      // Arrange
      const emptyResults: any[] = [];

      // Act
      app.displayResults(emptyResults);

      // Assert
      const resultsContainer = document.getElementById('results');
      expect(resultsContainer?.innerHTML).toContain('No results found');
      expect(resultsContainer?.innerHTML).toContain('Try searching for:');
    });
  });

  describe('Integration Features', () => {
    it('should add place to compare tray', () => {
      // Arrange
      const placeId = 'test-place-1';
      const mockPlace = {
        place_id: placeId,
        name: 'Test Place',
        rating: 4.5
      };

      app.lastAIResponse = {
        data: {
          uiPayload: {
            items: [mockPlace]
          }
        }
      };

      mockCompareTray.addToCompare.mockReturnValue(true);

      // Act
      app.addToCompare(placeId);

      // Assert
      expect(mockCompareTray.addToCompare).toHaveBeenCalledWith(mockPlace);
    });

    it('should show place details modal', () => {
      // Arrange
      const placeId = 'test-place-1';
      const mockPlace = {
        place_id: placeId,
        name: 'Test Place',
        rating: 4.5,
        address: '123 Test St'
      };

      app.lastAIResponse = {
        data: {
          uiPayload: {
            items: [mockPlace]
          }
        }
      };

      const displayModalSpy = vi.spyOn(app, 'displayPlaceModal');

      // Act
      app.showPlaceDetails(placeId);

      // Assert
      expect(displayModalSpy).toHaveBeenCalledWith(mockPlace);
    });

    it('should save place to itinerary', () => {
      // Arrange
      const placeId = 'test-place-1';
      const mockPlace = {
        place_id: placeId,
        name: 'Test Place',
        rating: 4.5
      };

      app.lastAIResponse = {
        data: {
          uiPayload: {
            items: [mockPlace]
          }
        }
      };

      const showNotificationSpy = vi.spyOn(app, 'showNotification');

      // Act
      app.savePlaceToItinerary(placeId);

      // Assert
      const savedPlaces = app.contextMemory.get('savedPlaces');
      expect(savedPlaces).toContainEqual(expect.objectContaining({
        place_id: placeId,
        name: 'Test Place'
      }));
      expect(showNotificationSpy).toHaveBeenCalledWith(
        'Saved "Test Place" to your itinerary',
        'success'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle AI orchestrator timeout', async () => {
      // Arrange
      const searchQuery = 'test query';
      const timeoutError = new Error('Request timeout');
      
      mockAIOrchestrator.orchestrate.mockRejectedValue(timeoutError);
      app.processMessageLocally = vi.fn().mockResolvedValue({
        text: 'Local fallback response',
        actions: []
      });

      // Act
      const result = await app.processAIMessage(searchQuery);

      // Assert
      expect(app.processMessageLocally).toHaveBeenCalledWith(searchQuery, expect.any(Object));
      expect(result.text).toBe('Local fallback response');
    });

    it('should handle malformed API response', async () => {
      // Arrange
      const searchQuery = 'test query';
      const malformedResponse = { success: true }; // Missing required data field
      
      mockAIOrchestrator.orchestrate.mockResolvedValue(malformedResponse);

      // Act
      const result = await app.processAIMessage(searchQuery);

      // Assert
      expect(result).toBeDefined();
      // Should handle gracefully without crashing
    });

    it('should handle network errors gracefully', async () => {
      // Arrange
      const searchQuery = 'test query';
      const networkError = new Error('Network error');
      
      mockAIOrchestrator.orchestrate.mockRejectedValue(networkError);
      
      const getErrorResponseSpy = vi.spyOn(app, 'getErrorResponse').mockReturnValue(
        'Search temporarily unavailable. Please try again.'
      );

      // Act
      const result = await app.processAIMessage(searchQuery);

      // Assert
      expect(getErrorResponseSpy).toHaveBeenCalledWith(networkError);
      expect(result).toContain('Search temporarily unavailable');
    });
  });

  describe('Performance', () => {
    it('should complete search within performance threshold', async () => {
      // Arrange
      const searchQuery = 'restaurants';
      const startTime = Date.now();
      
      mockAIOrchestrator.orchestrate.mockResolvedValue({
        success: true,
        data: { explanation: 'Found restaurants', uiPayload: { items: [] } }
      });

      // Act
      await app.processAIMessage(searchQuery);
      const endTime = Date.now();

      // Assert
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(5000); // 5 second threshold
    });

    it('should cache results appropriately', async () => {
      // Arrange
      const searchQuery = 'restaurants';
      const mockResponse = {
        success: true,
        data: { explanation: 'Found restaurants', uiPayload: { items: [] } }
      };
      
      mockAIOrchestrator.orchestrate.mockResolvedValue(mockResponse);

      // Act
      await app.processAIMessage(searchQuery);
      await app.processAIMessage(searchQuery); // Same query

      // Assert
      // Should only call orchestrator once due to caching
      expect(mockAIOrchestrator.orchestrate).toHaveBeenCalledTimes(1);
    });
  });
});