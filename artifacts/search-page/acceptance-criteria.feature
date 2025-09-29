Feature: Search Page - AI-Powered Travel Search

Background:
  Given the RoamWise application is loaded
  And the AI Orchestrator is initialized
  And the user is on the search page

Scenario: Happy path - Basic search with AI orchestration
  Given the user has granted location access
  And the weather API is responsive
  And the Google Places API is responsive
  When the user types "restaurants" in the search input
  And clicks the "Search" button
  Then the system should show "Searching..." loading state
  And the AI Orchestrator should be called with user query and context
  And search results should appear within 5 seconds
  And results should include at least 3 places
  And each result should display name, rating, distance, and price level
  And explainability chips should show AI reasoning
  And place action buttons (Compare, Details, Save) should be visible
  And the system should log successful search with correlation ID

Scenario: Happy path - Search with quick tag filters
  Given the user is on the search page
  When the user clicks on the "🍽️ Restaurants" quick tag
  Then the search input should auto-populate with "restaurants"
  And the search should execute automatically
  And results should be filtered to restaurant-type venues
  And the quick tag should be visually highlighted as active

Scenario: Happy path - Search with filters applied
  Given the user is on the search page
  When the user types "coffee shops" in the search input
  And checks "🕐 Open now" filter
  And checks "⭐ High rated (4.0+)" filter  
  And sets radius to "1 km"
  And clicks "Search"
  Then results should only include coffee shops that are currently open
  And all results should have rating >= 4.0
  And all results should be within 1km of user location
  And the applied filters should remain visually active

Scenario: Happy path - Two-pass planning activation
  Given the user is on the search page
  When the user types "plan a full day exploring the city with lunch and sightseeing"
  And clicks "Search"
  Then the system should detect complex planning request
  And activate two-pass planning mode
  And display "🎯 Using TWO-PASS AI Orchestrator (Anchors → Fillers)" in console
  And results should include both anchor activities and supporting activities
  And results should be grouped by priority (anchors first)

Scenario: Edge case - Location access denied
  Given the user has denied location access
  When the user performs a search
  Then the system should use default location fallback
  And show a notification "Using default location - enable location for better results"
  And search should still complete successfully
  And distance information should show "Distance unknown"

Scenario: Edge case - No search results found
  Given the user is on the search page
  When the user searches for "nonexistent place type xyz123"
  And the API returns no results
  Then the system should display "No results found"
  And suggest alternative search terms
  And provide quick action buttons for popular categories
  And log the empty result with search query for analytics

Scenario: Error - API timeout
  Given the user is on the search page
  When the user performs a search
  And the API takes longer than 10 seconds to respond
  Then the system should show timeout error message
  And provide "Try Again" button
  And fallback to cached results if available
  And log error with correlation ID and API endpoint

Scenario: Error - AI Orchestrator unavailable
  Given the AI Orchestrator fails to initialize
  When the user performs a search
  Then the system should fallback to direct API mode
  And display warning "AI features temporarily unavailable"
  And search should still return basic results
  And log fallback mode activation

Scenario: Performance - Search responsiveness
  Given the user is on the search page
  When the user types in the search input
  Then the input should respond immediately (< 100ms)
  And quick suggestions should appear within 300ms
  And the search button should be enabled/disabled appropriately

Scenario: Accessibility - Keyboard navigation
  Given the user is using keyboard navigation
  When the user tabs through the search interface
  Then all interactive elements should be reachable
  And focus indicators should be clearly visible
  And the user can trigger search using Enter key
  And screen readers should announce search state changes

Scenario: Accessibility - ARIA labels and roles
  Given the search page is loaded
  When a screen reader user navigates the page
  Then the search input should have proper aria-label
  And results should be announced when they load
  And loading states should be announced
  And explainability chips should have descriptive labels

Scenario: Integration - Compare tray interaction
  Given the user has search results displayed
  When the user clicks "Compare" on a result
  Then the item should be added to the compare tray
  And the compare tray should become visible
  And a success notification should appear
  And the compare button should update to show added state

Scenario: Integration - Rain plan interaction  
  Given the user has search results with outdoor venues
  And the weather shows >50% precipitation probability
  When the rain plan toggle is activated
  Then outdoor venues should be replaced with indoor alternatives
  And a notification should explain the weather-based changes
  And the rain plan indicator should show active state

Scenario: Data validation - Malformed API response
  Given the user performs a search
  When the API returns malformed JSON
  Then the system should handle the error gracefully
  And show "Search temporarily unavailable" message
  And log the malformed response for debugging
  And not crash or show technical error details to user

Scenario: Security - Input sanitization
  Given the user is on the search page
  When the user enters malicious input like "<script>alert('xss')</script>"
  Then the input should be properly sanitized
  And no scripts should execute
  And the search should either return safe results or show validation error
  And the sanitized query should be logged securely

Scenario: Internationalization - Multi-language support
  Given the user has set their language preference to Hebrew
  When the user performs a search
  Then the UI should display in Hebrew (RTL layout)
  And voice input should accept Hebrew speech
  And error messages should be in Hebrew
  And results should include Hebrew place names when available