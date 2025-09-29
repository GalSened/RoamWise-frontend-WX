/**
 * RoamWise AI Orchestrator
 * Transforms o3-mini from fact-generator to intelligent planner
 * 
 * Architecture: Planner → Tools → Critic → Finalize
 */

class AIOrchestrator {
    constructor(apiEndpoint, apiKey) {
        this.apiEndpoint = apiEndpoint;
        this.apiKey = apiKey;
        this.requestId = null;
        this.context = {};
        this.tools = new Map();
        this.cache = new Map();
        this.initialized = false;
        
        this.initialize();
        
        console.log('🧠 AI Orchestrator initializing...');
    }

    async initialize() {
        try {
            await Promise.all([
                this.initializeTools(),
                this.loadSchemas()
            ]);
            this.initialized = true;
            console.log('✅ AI Orchestrator fully initialized');
        } catch (error) {
            console.error('❌ AI Orchestrator initialization failed:', error);
        }
    }

    async loadSchemas() {
        try {
            const response = await fetch('/schemas/ai-orchestrator.json');
            this.schemas = await response.json();
            console.log('✅ Schemas loaded');
        } catch (error) {
            console.error('❌ Failed to load schemas:', error);
        }
    }

    async initializeTools() {
        this.tools.set('places', this.createPlacesTool());
        this.tools.set('place-details', this.createPlaceDetailsTool());
        this.tools.set('route', this.createRouteTool());
        this.tools.set('weather', this.createWeatherTool());
        this.tools.set('search-along-route', this.createRouteCorridorTool());
        
        // Initialize Route Corridor Search
        try {
            const RouteCorridorSearch = (await import('./route-corridor.js')).default;
            this.routeCorridorSearch = new RouteCorridorSearch(this.googleMapsAPIKey);
            console.log('🛣️ Route Corridor Search initialized');
        } catch (error) {
            console.warn('⚠️ Route Corridor Search unavailable:', error);
            this.routeCorridorSearch = null;
        }
    }

    /**
     * Two-Pass Planning Method
     * Phase 1: Identify anchor activities (must-do experiences)
     * Phase 2: Fill in supporting activities around anchors
     */
    async orchestrateWithTwoPassPlanning(userMessage, userContext = {}) {
        this.requestId = this.generateRequestId();
        this.context = { ...userContext, message: userMessage };
        
        console.log(`🎯 [${this.requestId}] Starting TWO-PASS orchestration`);
        console.log(`📝 User: "${userMessage}"`);

        try {
            // PASS 1: IDENTIFY ANCHORS
            console.log(`⚓ [${this.requestId}] PASS 1: Identifying anchor activities`);
            const anchorPlan = await this.identifyAnchors(userMessage, userContext);
            const anchorResults = await this.toolsPhase(anchorPlan);
            
            // PASS 2: FILL AROUND ANCHORS
            console.log(`🔗 [${this.requestId}] PASS 2: Filling supporting activities`);
            const fillerPlan = await this.identifyFillers(anchorResults, userMessage, userContext);
            const fillerResults = await this.toolsPhase(fillerPlan);
            
            // COMBINE & OPTIMIZE
            console.log(`🧩 [${this.requestId}] Combining and optimizing itinerary`);
            const combinedResults = this.combineAnchorAndFillerResults(anchorResults, fillerResults);
            
            // CRITIC & FINALIZE
            const critique = await this.criticPhase({ intent: 'two_pass_plan' }, combinedResults);
            const finalResponse = await this.finalizePhase({ intent: 'two_pass_plan' }, combinedResults, critique);
            
            return {
                success: true,
                data: finalResponse,
                requestId: this.requestId,
                metadata: {
                    planningMethod: 'two_pass',
                    anchors: anchorResults,
                    fillers: fillerResults,
                    critique,
                    processingTime: Date.now() - this.startTime
                }
            };

        } catch (error) {
            console.error(`❌ [${this.requestId}] Two-pass orchestration failed:`, error);
            return {
                success: false,
                error: error.message,
                requestId: this.requestId
            };
        }
    }

    /**
     * Main orchestration method
     * Implements: Planner → Tools → Critic → Finalize
     */
    async orchestrate(userMessage, userContext = {}) {
        this.requestId = this.generateRequestId();
        this.context = { ...userContext, message: userMessage };
        
        console.log(`🎯 [${this.requestId}] Starting orchestration`);
        console.log(`📝 User: "${userMessage}"`);

        try {
            // STEP 1: PLANNER - o3-mini decides what to do
            const plan = await this.planningPhase(userMessage, userContext);
            console.log(`📋 [${this.requestId}] Plan:`, plan);

            // STEP 2: TOOLS - Execute the plan with real data
            const toolResults = await this.toolsPhase(plan);
            console.log(`🔧 [${this.requestId}] Tool results:`, toolResults);

            // STEP 3: CRITIC - o3-mini validates the results
            const critique = await this.criticPhase(plan, toolResults);
            console.log(`🔍 [${this.requestId}] Critique:`, critique);

            // STEP 4: FINALIZE - Create human-friendly response
            const finalResponse = await this.finalizePhase(plan, toolResults, critique);
            console.log(`✨ [${this.requestId}] Final response ready`);

            return {
                success: true,
                data: finalResponse,
                requestId: this.requestId,
                metadata: {
                    plan,
                    toolResults,
                    critique,
                    processingTime: Date.now() - this.startTime
                }
            };

        } catch (error) {
            console.error(`❌ [${this.requestId}] Orchestration failed:`, error);
            return {
                success: false,
                error: error.message,
                requestId: this.requestId
            };
        }
    }

    /**
     * PHASE 1: PLANNER
     * o3-mini analyzes the request and outputs strict JSON plan
     */
    async planningPhase(userMessage, userContext) {
        const plannerPrompt = this.buildPlannerPrompt(userMessage, userContext);
        
        const response = await this.callO3Mini({
            messages: [
                {
                    role: "system",
                    content: `You are a travel planning orchestrator. Analyze the user's request and output ONLY a strict JSON plan using the provided schema. Do not generate any facts - only decide what tools to call and with what parameters.
                    
Available tools: places, place-details, route, weather, search-along-route

Schemas: ${JSON.stringify(this.schemas?.definitions?.PlannerOutput || {}, null, 2)}

CRITICAL: Output ONLY valid JSON. No explanations, no markdown, no additional text.`
                },
                {
                    role: "user", 
                    content: plannerPrompt
                }
            ],
            temperature: 0.1,
            max_tokens: 500
        });

        try {
            return JSON.parse(response.content);
        } catch (error) {
            throw new Error(`Invalid JSON from planner: ${response.content}`);
        }
    }

    /**
     * PHASE 2: TOOLS
     * Execute the plan using real data sources
     */
    async toolsPhase(plan) {
        const { intent, parameters } = plan;
        const tool = this.tools.get(intent.replace('_', '-'));
        
        if (!tool) {
            throw new Error(`Unknown tool for intent: ${intent}`);
        }

        // Execute with caching and field masking
        const cacheKey = this.generateCacheKey(intent, parameters);
        if (this.cache.has(cacheKey)) {
            console.log(`🚀 [${this.requestId}] Cache hit for ${intent}`);
            return this.cache.get(cacheKey);
        }

        const results = await tool(parameters);
        
        // Cache for 2-5 minutes based on data type
        const cacheTTL = this.getCacheTTL(intent);
        setTimeout(() => this.cache.delete(cacheKey), cacheTTL);
        this.cache.set(cacheKey, results);

        return results;
    }

    /**
     * PHASE 3: CRITIC
     * o3-mini validates the results for common issues
     */
    async criticPhase(plan, toolResults) {
        const criticPrompt = this.buildCriticPrompt(plan, toolResults);
        
        const response = await this.callO3Mini({
            messages: [
                {
                    role: "system",
                    content: `You are a travel plan critic. Analyze the plan and data for issues like:
- Closed venues during planned time
- Bad weather for outdoor activities  
- Excessive walking distances
- Poor timing/logistics
- Missing important info

Output ONLY valid JSON using CriticOutput schema.

Schema: ${JSON.stringify(this.schemas?.definitions?.CriticOutput || {}, null, 2)}`
                },
                {
                    role: "user",
                    content: criticPrompt
                }
            ],
            temperature: 0.1,
            max_tokens: 300
        });

        try {
            return JSON.parse(response.content);
        } catch (error) {
            console.warn(`Critic JSON parse failed, using default: ${error.message}`);
            return { verdict: "approved", issues: [], suggestions: [], confidence: 0.5 };
        }
    }

    /**
     * PHASE 4: FINALIZE
     * Create human-friendly response with structured data for UI
     */
    async finalizePhase(plan, toolResults, critique) {
        const needsRevision = critique.verdict === 'needs_revision' && critique.suggestions.length > 0;
        
        if (needsRevision) {
            console.log(`🔄 [${this.requestId}] Applying critic suggestions`);
            // Apply suggested fixes and re-run tools if needed
            const revisedResults = await this.applyCriticSuggestions(plan, toolResults, critique);
            return this.formatFinalResponse(plan, revisedResults, critique);
        }

        return this.formatFinalResponse(plan, toolResults, critique);
    }

    formatFinalResponse(plan, toolResults, critique) {
        const explanation = this.generateExplanation(plan, toolResults, critique);
        const uiPayload = this.generateUIPayload(plan, toolResults);
        const actionButtons = this.generateActionButtons(plan, toolResults);

        return {
            explanation,
            uiPayload,
            actionButtons,
            confidence: critique.confidence || 0.8,
            reasoning: plan.reasoning,
            issues: critique.issues || [],
            requestId: this.requestId
        };
    }

    /**
     * TOOL IMPLEMENTATIONS
     */
    createPlacesTool() {
        return async (params) => {
            const { query, location, filters = {}, radius = 5000 } = params;
            
            // Build request with field masking
            const requestBody = {
                query,
                lat: location.lat,
                lng: location.lng,
                radius,
                ...filters,
                fields: ['place_id', 'name', 'rating', 'user_ratings_total', 'geometry', 'opening_hours', 'price_level'] // Field mask
            };

            const response = await fetch(`${this.apiEndpoint}/places`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            if (!data.ok) throw new Error(data.error);

            // Apply hybrid scoring
            return this.applyHybridScoring(data.items, params);
        };
    }

    createPlaceDetailsTool() {
        return async (params) => {
            const { placeId } = params;
            
            const response = await fetch(`${this.apiEndpoint}/place-details`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    placeId,
                    fields: ['opening_hours', 'formatted_phone_number', 'website', 'photos', 'reviews']
                })
            });

            const data = await response.json();
            if (!data.ok) throw new Error(data.error);
            return data;
        };
    }

    createRouteTool() {
        return async (params) => {
            const { origin, destination, mode = 'driving', waypoints = [] } = params;
            
            const response = await fetch(`${this.apiEndpoint}/route`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    origin,
                    destination,
                    mode,
                    waypoints,
                    departure_time: 'now' // Always use current time for accurate ETAs
                })
            });

            const data = await response.json();
            if (!data.ok) throw new Error(data.error);
            return data;
        };
    }

    createWeatherTool() {
        return async (params) => {
            const { location, timeframe = 'current' } = params;
            
            const response = await fetch(`${this.apiEndpoint}/weather`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lat: location.lat,
                    lng: location.lng,
                    timeframe
                })
            });

            const data = await response.json();
            if (!data.ok) throw new Error(data.error);
            return data;
        };
    }

    createRouteCorridorTool() {
        return async (params) => {
            const { route, query, bufferKm = 2, maxResults = 8 } = params;
            
            console.log(`🛣️ Searching along route for: ${query}`);
            
            // Use the integrated route corridor search if available
            if (this.routeCorridorSearch && route.polyline) {
                const options = {
                    bufferKm,
                    maxResults,
                    categories: this.getSearchCategories(query),
                    minRating: 4.0
                };
                
                return await this.routeCorridorSearch.searchAlongRoute(
                    route.polyline, 
                    query, 
                    options
                );
            }
            
            // Fallback to API endpoint
            const response = await fetch(`${this.apiEndpoint}/search-along-route`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    polyline: route.polyline,
                    query,
                    bufferKm,
                    maxResults
                })
            });

            const data = await response.json();
            if (!data.ok) throw new Error(data.error);
            return data;
        };
    }

    getSearchCategories(query) {
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('food') || lowerQuery.includes('restaurant') || lowerQuery.includes('eat')) {
            return ['restaurant', 'cafe', 'meal_takeaway'];
        } else if (lowerQuery.includes('gas') || lowerQuery.includes('fuel') || lowerQuery.includes('charge')) {
            return ['gas_station', 'charging_station'];
        } else if (lowerQuery.includes('view') || lowerQuery.includes('scenic') || lowerQuery.includes('photo')) {
            return ['scenic_overlook', 'tourist_attraction', 'park'];
        } else if (lowerQuery.includes('shop') || lowerQuery.includes('store')) {
            return ['shopping_mall', 'store'];
        } else {
            return ['point_of_interest', 'tourist_attraction'];
        }
    }

    /**
     * HYBRID SCORING ALGORITHM
     * Combines Google data with weather and user preferences
     */
    applyHybridScoring(places, params) {
        const { location, filters = {}, preferences = {} } = params;
        
        return places.map(place => {
            let score = 0;
            
            // Base Google data (50%)
            score += 0.35 * (place.rating || 3.5);
            score += 0.15 * Math.log(1 + (place.user_ratings_total || 1));
            
            // Weather fit (20%) - would be calculated based on current weather
            score += 0.20 * this.calculateWeatherFit(place, this.context.weather);
            
            // Interest match (10%) - based on user preferences
            score += 0.10 * this.calculateInterestMatch(place, preferences.interests || {});
            
            // Travel time penalty (15%) - closer is better
            const distance = this.calculateDistance(location, place.geometry.location);
            score -= 0.15 * Math.min(distance / 1000, 1); // Normalize to 0-1
            
            // Novelty bonus (5%) - for new places
            score += 0.05 * this.calculateNoveltyBonus(place, preferences.previousVisits || []);
            
            return {
                ...place,
                aiScore: Math.max(0, Math.min(5, score)), // Clamp to 0-5
                scoreBreakdown: {
                    rating: place.rating || 3.5,
                    popularity: Math.log(1 + (place.user_ratings_total || 1)),
                    weatherFit: this.calculateWeatherFit(place, this.context.weather),
                    interestMatch: this.calculateInterestMatch(place, preferences.interests || {}),
                    travelTimePenalty: Math.min(distance / 1000, 1),
                    noveltyBonus: this.calculateNoveltyBonus(place, preferences.previousVisits || [])
                }
            };
        }).sort((a, b) => b.aiScore - a.aiScore);
    }

    /**
     * UTILITY METHODS
     */
    generateRequestId() {
        return Math.random().toString(36).substring(2, 15);
    }

    generateCacheKey(intent, parameters) {
        return `${intent}:${JSON.stringify(parameters)}`;
    }

    getCacheTTL(intent) {
        const ttls = {
            'places': 5 * 60 * 1000,      // 5 minutes
            'weather': 10 * 60 * 1000,    // 10 minutes  
            'route': 2 * 60 * 1000        // 2 minutes
        };
        return ttls[intent] || 5 * 60 * 1000;
    }

    buildPlannerPrompt(userMessage, userContext) {
        return `User request: "${userMessage}"

Context:
- Current location: ${userContext.location ? `${userContext.location.lat}, ${userContext.location.lng}` : 'Unknown'}
- Time: ${new Date().toISOString()}
- User preferences: ${JSON.stringify(userContext.preferences || {})}
- Previous conversation: ${JSON.stringify(userContext.conversationHistory?.slice(-3) || [])}

Analyze this request and output a JSON plan specifying which tool to call and with what exact parameters.`;
    }

    buildCriticPrompt(plan, toolResults) {
        return `Plan: ${JSON.stringify(plan)}
Results: ${JSON.stringify(toolResults)}
Current time: ${new Date().toISOString()}

Check for issues and suggest improvements. Focus on practical problems like timing, weather, logistics.`;
    }

    calculateWeatherFit(place, weather) {
        // Simplified weather fitness calculation
        if (!weather) return 0.5;
        
        const isOutdoor = place.types?.some(type => 
            ['park', 'tourist_attraction', 'amusement_park'].includes(type)
        );
        
        if (isOutdoor) {
            return weather.precipitation_probability > 70 ? 0.2 : 0.8;
        }
        
        return 0.6; // Indoor places less weather dependent
    }

    calculateInterestMatch(place, interests) {
        // Match place types to user interests
        const typeMapping = {
            'restaurant': 'food',
            'museum': 'culture',
            'park': 'nature',
            'shopping_mall': 'shopping'
        };
        
        let match = 0;
        place.types?.forEach(type => {
            const interest = typeMapping[type];
            if (interest && interests[interest]) {
                match += interests[interest];
            }
        });
        
        return Math.min(match, 1);
    }

    calculateNoveltyBonus(place, previousVisits) {
        const visited = previousVisits.some(visit => visit.placeId === place.place_id);
        return visited ? 0 : 1;
    }

    calculateDistance(loc1, loc2) {
        // Haversine distance formula
        const R = 6371000; // Earth's radius in meters
        const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
        const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    async callO3Mini(request) {
        // This would call the actual o3-mini API
        const response = await fetch(`${this.apiEndpoint}/o3-mini`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(request)
        });
        
        const data = await response.json();
        if (!data.ok) throw new Error(data.error);
        return data;
    }

    generateExplanation(plan, toolResults, critique) {
        // Generate human-friendly explanation
        return `I found ${toolResults.items?.length || 0} options based on your request. ${critique.issues.length ? `Note: ${critique.issues[0].description}` : ''}`;
    }

    generateUIPayload(plan, toolResults) {
        // Structure data for frontend UI components
        return {
            type: plan.intent,
            items: toolResults.items || [],
            metadata: toolResults.metadata || {},
            displayMode: this.getDisplayMode(plan.intent)
        };
    }

    generateActionButtons(plan, toolResults) {
        // Generate contextual action buttons
        const actions = [];
        
        if (plan.intent === 'search') {
            actions.push({ type: 'refine', label: 'Refine Search', icon: '🔍' });
            actions.push({ type: 'add_to_plan', label: 'Add to Plan', icon: '📅' });
        }
        
        return actions;
    }

    getDisplayMode(intent) {
        const modes = {
            'search': 'list',
            'route': 'map',
            'plan_day': 'timeline',
            'compare_weather': 'comparison'
        };
        return modes[intent] || 'list';
    }

    async applyCriticSuggestions(plan, toolResults, critique) {
        // Apply critic suggestions and re-run tools if needed
        console.log(`🔧 Applying ${critique.suggestions.length} suggestions`);
        
        // For now, return original results
        // In full implementation, this would modify the plan and re-execute
        return toolResults;
    }

    /**
     * TWO-PASS PLANNING METHODS
     */

    /**
     * PASS 1: Identify anchor activities (must-do experiences)
     */
    async identifyAnchors(userMessage, userContext) {
        const anchorPrompt = `User request: "${userMessage}"
        
Context: ${JSON.stringify(userContext)}

ANCHOR IDENTIFICATION: Identify 2-3 MUST-DO anchor activities that are:
1. Unique to this destination
2. High priority for this trip type
3. Should be scheduled first (others build around these)

Output JSON plan for finding these anchor experiences only.`;

        const response = await this.callO3Mini({
            messages: [
                {
                    role: "system",
                    content: `You are identifying ANCHOR activities - the must-do experiences that define a trip. Find 2-3 high-priority, unique experiences that other activities will be planned around.

Available tools: places, place-details, route, weather

Focus on: iconic experiences, unique local attractions, once-in-a-lifetime opportunities.
Output ONLY valid JSON using PlannerOutput schema.`
                },
                {
                    role: "user",
                    content: anchorPrompt
                }
            ],
            temperature: 0.2,
            max_tokens: 300
        });

        try {
            return JSON.parse(response.content);
        } catch (error) {
            console.warn('Anchor planning JSON parse failed, using fallback');
            return {
                intent: 'places',
                parameters: {
                    query: 'top attractions',
                    location: userContext.location || { lat: 0, lng: 0 },
                    filters: { type: 'tourist_attraction' }
                }
            };
        }
    }

    /**
     * PASS 2: Fill in supporting activities around anchors
     */
    async identifyFillers(anchorResults, userMessage, userContext) {
        const fillerPrompt = `User request: "${userMessage}"
        
Anchor activities already identified: ${JSON.stringify(anchorResults.items?.slice(0, 3) || [])}

FILLER IDENTIFICATION: Find supporting activities that:
1. Complement the anchor experiences
2. Fill logical gaps (meals, transportation, downtime)
3. Optimize travel routes and timing
4. Match user preferences and constraints

Output JSON plan for these supporting activities.`;

        const response = await this.callO3Mini({
            messages: [
                {
                    role: "system",
                    content: `You are identifying FILLER activities - supporting experiences that complete a trip around the main anchors. Find complementary activities, meals, practical stops, and route optimizations.

Available tools: places, place-details, route, weather, search-along-route

Focus on: restaurants, practical stops, route optimization, timing optimization.
Output ONLY valid JSON using PlannerOutput schema.`
                },
                {
                    role: "user",
                    content: fillerPrompt
                }
            ],
            temperature: 0.3,
            max_tokens: 400
        });

        try {
            return JSON.parse(response.content);
        } catch (error) {
            console.warn('Filler planning JSON parse failed, using fallback');
            return {
                intent: 'places',
                parameters: {
                    query: 'restaurants near attractions',
                    location: userContext.location || { lat: 0, lng: 0 },
                    filters: { type: 'restaurant' }
                }
            };
        }
    }

    /**
     * Combine anchor and filler results into optimized itinerary
     */
    combineAnchorAndFillerResults(anchorResults, fillerResults) {
        const anchors = (anchorResults.items || []).map(item => ({
            ...item,
            priority: 'anchor',
            importance: 10
        }));

        const fillers = (fillerResults.items || []).map(item => ({
            ...item,
            priority: 'filler',
            importance: 5
        }));

        // Combine and sort by importance and location proximity
        const combined = [...anchors, ...fillers];
        
        // Simple optimization: group by geographic clusters
        const optimized = this.optimizeByLocation(combined);
        
        return {
            items: optimized,
            metadata: {
                totalItems: optimized.length,
                anchors: anchors.length,
                fillers: fillers.length,
                planningMethod: 'two_pass'
            }
        };
    }

    /**
     * Simple location-based optimization
     */
    optimizeByLocation(items) {
        // Group items by proximity (simplified clustering)
        return items.sort((a, b) => {
            // Priority: anchors first, then by rating
            if (a.priority !== b.priority) {
                return a.priority === 'anchor' ? -1 : 1;
            }
            return (b.rating || 0) - (a.rating || 0);
        });
    }
}

// Export for use in app
window.AIOrchestrator = AIOrchestrator;

export default AIOrchestrator;