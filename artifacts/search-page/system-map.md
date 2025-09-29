# System Map - Search Page

## Page Overview
**Key**: search-page
**Name**: Search Page  
**Purpose**: Core search functionality with AI orchestrator integration

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Search UI     │    │  AI Orchestrator │    │   Backend APIs      │
│                 │    │                  │    │                     │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────────┐ │
│ │ Search Input│ │◄───┤ │   Planner    │ │◄───┤ │ Google Places   │ │
│ │   Component │ │    │ │              │ │    │ │      API        │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────────┘ │
│                 │    │                  │    │                     │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────────┐ │
│ │ Results     │ │◄───┤ │    Tools     │ │◄───┤ │ Weather API     │ │
│ │   Display   │ │    │ │              │ │    │ │                 │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────────┘ │
│                 │    │                  │    │                     │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────────┐ │
│ │ Quick Tags  │ │◄───┤ │    Critic    │ │◄───┤ │ Route API       │ │
│ │             │ │    │ │              │ │    │ │                 │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────────┘ │
│                 │    │                  │    │                     │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │                     │
│ │ Explain.    │ │◄───┤ │   Finalize   │ │    │                     │
│ │   Chips     │ │    │ │              │ │    │                     │
│ └─────────────┘ │    │ └──────────────┘ │    │                     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

## Data Flow

1. **User Input** → Search query entered in text input
2. **Context Building** → AI Orchestrator gathers user preferences, location, weather
3. **Planning Phase** → Planner analyzes query and decides on search strategy
4. **Tools Execution** → Real APIs called (Places, Weather, Route) with field masking
5. **Scoring** → Hybrid algorithm combines Google data + weather + user preferences  
6. **Critic Validation** → Reviews results for issues (closed venues, bad weather, etc.)
7. **Finalization** → Results formatted with explainability chips and UI payload
8. **Display** → Structured results shown with compare/save/details actions

## Files & Components

### Core Files
- `app.js` - Main application controller
- `src/ai-orchestrator.js` - Core orchestration engine  
- `src/explainability-chips.js` - AI reasoning display
- `src/compare-tray.js` - Comparison functionality
- `index.html` - Main UI structure

### API Endpoints
- Primary: `${this.aiEndpoint}/o3-mini` (AI orchestration)
- Places: `${this.apiEndpoint}/places` (search execution)
- Weather: `${this.apiEndpoint}/weather` (weather data)
- Route: `${this.apiEndpoint}/route` (routing for corridor search)

### Key Methods
- `RoamWiseApp.processAIMessage()` - Main search entry point
- `AIOrchestrator.orchestrate()` - Core orchestration workflow
- `AIOrchestrator.applyHybridScoring()` - Result ranking
- `ExplainabilityChips.generateChips()` - Reasoning display

### State Management
- `this.lastAIResponse` - Stores orchestrated response for place lookup
- `this.userLocation` - User's current location
- `this.selectedInterests` - User preference tracking
- `this.contextMemory` - Conversation context and user history

### Dependencies
- AI Orchestrator component initialization
- Google Maps/Places API integration
- Weather API integration
- Voice Recognition API (Speech API)
- Compare Tray integration