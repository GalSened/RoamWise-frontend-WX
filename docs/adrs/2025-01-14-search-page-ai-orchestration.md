# ADR-001: Search Page AI Orchestration Architecture

**Date**: 2025-01-14  
**Status**: Accepted  
**Deciders**: Development Team  

## Context

RoamWise requires a sophisticated search experience that leverages AI to provide personalized, context-aware travel recommendations. The search functionality needs to integrate multiple data sources (Google Places, Weather, Route APIs) while maintaining performance and providing transparent AI reasoning.

## Decision

We will implement a multi-layered AI orchestration architecture for the search page with the following components:

### 1. AI Orchestrator Pattern
Implement the Planner → Tools → Critic → Finalize workflow:
- **Planner**: o3-mini analyzes user query and outputs structured JSON plan
- **Tools**: Execute real API calls with field masking and caching
- **Critic**: Validate results for practical issues (weather, timing, logistics)
- **Finalize**: Format for UI with explainability and actions

### 2. Hybrid Scoring Algorithm
Combine multiple factors for result ranking:
```
score = 0.35*rating + 0.15*log(reviews) + 0.20*weather_fit + 
        0.10*interest_match - 0.15*travel_time_pen + 0.05*novelty
```

### 3. Two-Pass Planning Detection
Automatically detect complex queries requiring anchor → filler planning strategy.

### 4. Explainability System
Provide transparent AI reasoning through visual chips showing scoring factors.

## Rationale

### Why AI Orchestrator over Direct API?
- **Consistency**: Structured JSON contracts prevent AI hallucination
- **Context Integration**: Combines weather, preferences, and location intelligently  
- **Quality Control**: Critic phase validates results before user display
- **Transparency**: Explainability chips show reasoning process

### Why Hybrid Scoring?
- **Relevance**: Balances objective data (Google ratings) with subjective preferences
- **Context Awareness**: Weather and timing influence outdoor activity scoring
- **Personalization**: User interests and history affect recommendations
- **Performance**: Pre-calculated scores enable fast result rendering

### Why Two-Pass Planning?
- **Complex Queries**: Handles "plan a day" requests better than single-pass
- **Priority Ordering**: Anchors (must-do) identified first, fillers added around them
- **Route Optimization**: Supports geographic clustering and travel efficiency

## Alternatives Considered

### 1. Direct API Integration
**Rejected**: Lacks context integration and personalization depth
- Pro: Simpler implementation, faster initial development
- Con: No weather awareness, limited personalization, no explainability

### 2. Client-Side AI Processing
**Rejected**: Performance and privacy concerns
- Pro: No server dependency, real-time processing
- Con: Limited model capability, device performance impact, model updates

### 3. Simple Rule-Based Filtering
**Rejected**: Insufficient for personalized recommendations
- Pro: Predictable, fast, easy to debug
- Con: No learning capability, poor user experience, limited adaptability

## Implementation Details

### Error Handling Strategy
1. **AI Orchestrator Failure**: Graceful fallback to direct API mode
2. **API Timeout**: Show cached results if available, otherwise retry option
3. **Malformed Response**: Log for debugging, show user-friendly error message
4. **Rate Limiting**: Implement exponential backoff and result caching

### Performance Optimizations
1. **Field Masking**: Only request needed data fields from APIs
2. **Result Caching**: 5-minute cache for search results, 10-minute for weather
3. **Request Debouncing**: Prevent excessive API calls during typing
4. **Lazy Loading**: Load place details only when user requests them

### Security Considerations
1. **Input Sanitization**: All user inputs sanitized before API calls
2. **Rate Limiting**: Client-side throttling to prevent abuse
3. **Error Information**: No sensitive data exposed in error messages
4. **API Keys**: Secure handling through environment variables

## Consequences

### Positive
- **Enhanced User Experience**: Personalized, context-aware recommendations
- **Transparency**: Users understand why recommendations were made
- **Scalability**: Modular architecture supports feature additions
- **Performance**: Caching and field masking optimize API usage
- **Reliability**: Multiple fallback strategies ensure service availability

### Negative
- **Complexity**: More moving parts increase debugging difficulty
- **Dependencies**: Reliance on external AI and mapping services
- **Cost**: Additional API calls for weather and route data
- **Latency**: Multi-step orchestration adds processing time

### Neutral
- **Learning Curve**: Team needs to understand AI orchestration patterns
- **Monitoring**: Requires comprehensive logging and error tracking
- **Testing**: More complex test scenarios needed for integration testing

## Monitoring & Success Metrics

### Technical Metrics
- AI Orchestrator success rate (target: >95%)
- Search response time (target: <5 seconds)
- Cache hit ratio (target: >60%)
- Error rate by component (target: <5%)

### User Experience Metrics
- Search completion rate (target: >90%)
- Result click-through rate (target: >30%)
- Explainability chip interaction rate
- Compare tray usage adoption

### Business Metrics
- User session duration increase
- Search-to-action conversion rate
- Feature adoption (voice, filters, quick tags)

## Implementation Plan

### Phase 1: Core Orchestration (Week 1)
- AI Orchestrator integration
- Basic hybrid scoring
- Error handling and fallbacks

### Phase 2: Enhanced Features (Week 2)  
- Explainability chips
- Two-pass planning detection
- Compare tray integration

### Phase 3: Optimization (Week 3)
- Performance tuning
- Advanced caching strategies
- A/B testing framework

### Phase 4: Analytics (Week 4)
- Comprehensive monitoring
- User behavior tracking
- Success metric collection

## Review Date

This ADR should be reviewed in 3 months (April 2025) to assess:
- Performance against success metrics
- User feedback and adoption rates
- Technical debt and maintenance burden
- Potential architecture improvements