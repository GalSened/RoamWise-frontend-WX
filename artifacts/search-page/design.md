# Design Specification - Search Page

## UI/UX Design Updates

### Current Implementation Analysis
The search page currently exists with functional AI orchestrator integration. Key improvements needed:

### 1. Enhanced Search Input Component
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Smart Search                        🎤 Voice | ⚙️   │
├─────────────────────────────────────────────────────────┤
│ [What kind of experience are you looking for?         ] │
│ [Search] [Clear]                                        │
├─────────────────────────────────────────────────────────┤
│ Quick Filters:                                          │
│ ☐ Open now  ☐ High rated (4.0+)  📍 Radius: [2km ▼]  │
├─────────────────────────────────────────────────────────┤
│ 🍕 Food & Drinks                                       │
│ [🍽️ Restaurants] [🍕 Pizza] [🍦 Ice Cream] [☕ Cafes] │
│                                                         │
│ 🏛️ Attractions & Views                                 │
│ [🏛️ Attractions] [🌄 Viewpoints] [🏛️ Museums] [🌳 Parks] │
│                                                         │
│ 🚴 Activities                                          │
│ [🥾 Hiking] [🚴 Biking] [🎯 Entertainment] [🛍️ Shopping] │
└─────────────────────────────────────────────────────────┘
```

### 2. Enhanced Results Display Component
```
┌─────────────────────────────────────────────────────────┐
│ 🎯 Search Results (12 found) - AI Orchestrated         │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📍 Café Luna                              ⭐ 4.6/5  │ │
│ │ 📍 123 Main St, 0.3km away               💰 $$      │ │
│ │ ────────────────────────────────────────────────────  │ │
│ │ ⚖️ High Rated  🔥 Popular  ☀️ Perfect Weather       │ │
│ │ 🤖 AI Score: 4.2/5 ⓘ                               │ │
│ │ ────────────────────────────────────────────────────  │ │
│ │ [⚖️ Compare] [ℹ️ Details] [📅 Save]                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📍 The Garden Bistro                     ⭐ 4.4/5  │ │
│ │ 📍 456 Oak Ave, 0.8km away               💰 $$$     │ │
│ │ ────────────────────────────────────────────────────  │ │
│ │ 💝 Matches Interests  🌤️ Good Weather  📍 Nearby    │ │
│ │ 🤖 AI Score: 4.0/5 ⓘ                               │ │
│ │ ────────────────────────────────────────────────────  │ │
│ │ [⚖️ Compare] [ℹ️ Details] [📅 Save]                  │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3. Progressive Enhancement States
```
Loading State:
┌─────────────────────────────────────────┐
│ 🧠 AI is analyzing your request...      │
│ ████████████████████████░░░░░░░░ 75%    │
│ Finding personalized recommendations    │
└─────────────────────────────────────────┘

Error State:
┌─────────────────────────────────────────┐
│ ⚠️ Search temporarily unavailable       │
│ Our AI is taking a coffee break         │
│ [Try Again] [Use Basic Search]          │
└─────────────────────────────────────────┘

Empty State:
┌─────────────────────────────────────────┐
│ 🤷‍♀️ No results found                    │
│ Try searching for:                      │
│ [🍽️ Restaurants] [🏛️ Museums] [🌳 Parks] │
└─────────────────────────────────────────┘
```

## API Contract Definitions

### Search Request Schema
```json
{
  "query": "string",
  "location": {
    "lat": "number",
    "lng": "number"
  },
  "filters": {
    "openNow": "boolean",
    "minRating": "number",
    "radius": "number",
    "priceLevel": "number[]",
    "types": "string[]"
  },
  "userPreferences": {
    "interests": "string[]",
    "previousVisits": "object[]",
    "budgetCategory": "string"
  },
  "context": {
    "weather": "object",
    "timeOfDay": "string",
    "planType": "string"
  }
}
```

### Search Response Schema
```json
{
  "success": "boolean",
  "data": {
    "explanation": "string",
    "uiPayload": {
      "type": "string",
      "items": [
        {
          "place_id": "string",
          "name": "string",
          "address": "string",
          "rating": "number",
          "user_ratings_total": "number",
          "price_level": "number",
          "types": "string[]",
          "geometry": {
            "location": {
              "lat": "number",
              "lng": "number"
            }
          },
          "opening_hours": {
            "open_now": "boolean"
          },
          "distance": "number",
          "aiScore": "number",
          "scoreBreakdown": {
            "rating": "number",
            "popularity": "number",
            "weatherFit": "number",
            "interestMatch": "number",
            "efficiency": "number"
          },
          "explainabilityChips": "string[]",
          "photos": "object[]"
        }
      ],
      "metadata": {
        "totalResults": "number",
        "planningMethod": "string"
      }
    },
    "actionButtons": "object[]",
    "confidence": "number"
  },
  "requestId": "string"
}
```

## State Management Architecture

### Search State Flow
```typescript
interface SearchState {
  // Input state
  query: string;
  filters: SearchFilters;
  isVoiceActive: boolean;
  
  // Loading state
  isSearching: boolean;
  searchProgress: number;
  
  // Results state  
  results: PlaceResult[];
  totalResults: number;
  error: string | null;
  
  // AI state
  aiExplanation: string;
  confidence: number;
  planningMethod: 'standard' | 'two_pass';
  
  // Integration state
  selectedForCompare: string[];
  explainabilityExpanded: string[];
}

interface SearchActions {
  setQuery: (query: string) => void;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  executeSearch: (query: string, filters: SearchFilters) => Promise<void>;
  clearResults: () => void;
  addToCompare: (placeId: string) => void;
  showPlaceDetails: (placeId: string) => void;
  saveToItinerary: (placeId: string) => void;
}
```

## Error Handling Strategy

### Error Categories & Responses
1. **Network Errors**
   - Display: "Connection issue - check your internet"
   - Action: Retry button, offline mode suggestion
   - Log: Network status, endpoint, timestamp

2. **API Errors**
   - Display: "Search service temporarily unavailable"
   - Action: Fallback to cached results or basic search
   - Log: HTTP status, error response, request ID

3. **Validation Errors**
   - Display: Inline field validation messages
   - Action: Clear guidance on valid inputs
   - Log: Input validation failures for UX improvement

4. **AI Orchestrator Errors**
   - Display: "AI features temporarily unavailable"
   - Action: Fallback to direct API mode
   - Log: Orchestrator state, fallback activation

## Logging & Observability

### Search Event Logging
```typescript
interface SearchEvent {
  eventType: 'search_initiated' | 'search_completed' | 'search_error';
  requestId: string;
  timestamp: string;
  userId?: string;
  searchQuery: string;
  filters: SearchFilters;
  responseTime?: number;
  resultCount?: number;
  errorCode?: string;
  planningMethod?: string;
  confidence?: number;
}
```

### Performance Metrics
- Search response time (p50, p90, p95)
- AI Orchestrator success rate
- Cache hit ratio
- Error rate by error type
- User interaction patterns (clicks, filters, voice usage)

### User Experience Metrics
- Search completion rate
- Result click-through rate
- Filter usage patterns
- Voice input adoption
- Compare tray usage

## Accessibility Enhancements

### Keyboard Navigation
- Tab order: Search input → Filters → Quick tags → Results → Actions
- Enter key triggers search from input field
- Arrow keys navigate between quick tag buttons
- Space/Enter activates buttons and checkboxes

### Screen Reader Support
```html
<!-- Search input with proper labeling -->
<label for="search-input" class="sr-only">
  Search for restaurants, attractions, or activities
</label>
<input 
  id="search-input"
  aria-describedby="search-help"
  aria-expanded="false"
  aria-haspopup="listbox"
/>
<div id="search-help" class="sr-only">
  Type to search, use voice button, or select quick categories below
</div>

<!-- Results with proper structure -->
<div role="region" aria-label="Search results" aria-live="polite">
  <h2 id="results-heading">12 places found</h2>
  <ul aria-labelledby="results-heading">
    <li role="article" aria-labelledby="place-1-name">
      <h3 id="place-1-name">Café Luna</h3>
      <!-- Place details -->
    </li>
  </ul>
</div>
```

### Visual Accessibility
- High contrast focus indicators (4.5:1 minimum)
- Color-blind friendly icons and status indicators
- Scalable text (up to 200% zoom)
- Reduced motion preferences respected

## Mobile Responsiveness

### Breakpoint Strategy
- **Mobile**: < 768px - Single column, bottom sheet details
- **Tablet**: 768px - 1024px - Two column layout with sidebar
- **Desktop**: > 1024px - Multi-column with integrated panels

### Touch Interactions
- Minimum 44px touch targets
- Swipe gestures for result navigation
- Pull-to-refresh for result updates
- Voice button prominent and accessible