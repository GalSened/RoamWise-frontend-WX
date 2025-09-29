/**
 * Route Stops UI Component
 * Interactive "Stops Along Route" interface
 * 
 * Shows great places to stop along planned routes with zero detours
 */

class RouteStopsUI {
    constructor(container, routeData, orchestrator) {
        this.container = container;
        this.routeData = routeData;
        this.orchestrator = orchestrator;
        this.currentStops = [];
        this.isSearching = false;
        
        this.render();
        this.setupEventListeners();
    }

    render() {
        const routeDistance = this.formatDistance(this.routeData.distance);
        const routeDuration = this.formatDuration(this.routeData.duration);
        
        this.container.innerHTML = `
            <div class="route-stops-widget">
                <!-- Route Summary -->
                <div class="route-summary">
                    <div class="route-info">
                        <h3 class="route-title">
                            🛣️ ${this.routeData.origin.name} → ${this.routeData.destination.name}
                        </h3>
                        <div class="route-stats">
                            <span class="stat">${routeDistance}</span>
                            <span class="stat">${routeDuration}</span>
                        </div>
                    </div>
                    <button class="route-stops-toggle" id="toggleRouteStops">
                        Find Great Stops
                    </button>
                </div>

                <!-- Quick Search Categories -->
                <div class="stops-categories" id="stopsCategories" style="display: none;">
                    <div class="category-header">
                        <h4>What would you like to find along the way?</h4>
                        <div class="buffer-control">
                            <label for="bufferRange">Search radius: <span id="bufferValue">2</span>km</label>
                            <input type="range" id="bufferRange" min="1" max="5" value="2" step="0.5">
                        </div>
                    </div>
                    
                    <div class="category-buttons">
                        <button class="category-btn" data-category="food">
                            🍽️ Great Food
                        </button>
                        <button class="category-btn" data-category="scenic">
                            📸 Scenic Views
                        </button>
                        <button class="category-btn" data-category="fuel">
                            ⛽ Fuel & Charging
                        </button>
                        <button class="category-btn" data-category="attractions">
                            🎯 Attractions
                        </button>
                        <button class="category-btn" data-category="shopping">
                            🛍️ Shopping
                        </button>
                        <button class="category-btn" data-category="rest">
                            🏨 Rest Areas
                        </button>
                    </div>
                    
                    <div class="custom-search">
                        <input type="text" id="customStopSearch" placeholder="Or search for something specific...">
                        <button id="customSearchBtn">🔍</button>
                    </div>
                </div>

                <!-- Search Results -->
                <div class="route-stops-results" id="routeStopsResults" style="display: none;">
                    <div class="results-header">
                        <h4 id="resultsTitle">Finding stops along your route...</h4>
                        <button class="close-results" id="closeResults">✕</button>
                    </div>
                    <div class="stops-list" id="stopsList">
                        <!-- Results will be inserted here -->
                    </div>
                </div>
            </div>

            <style>
                .route-stops-widget {
                    background: var(--surface);
                    border: 2px solid var(--glass-border);
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-lg);
                    margin: var(--space-lg) 0;
                    overflow: hidden;
                    backdrop-filter: var(--backdrop-blur);
                }

                .route-summary {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-lg);
                    background: linear-gradient(135deg, rgba(0, 102, 204, 0.1), rgba(0, 170, 136, 0.05));
                    border-bottom: 1px solid var(--border);
                }

                .route-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--text-emphasis);
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .route-stats {
                    display: flex;
                    gap: var(--space-md);
                    margin-top: var(--space-sm);
                }

                .stat {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-emphasis);
                    background: var(--surface-hover);
                    padding: var(--space-sm) var(--space-md);
                    border-radius: var(--radius-full);
                    border: 1px solid var(--border);
                }

                .route-stops-toggle {
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    color: white;
                    border: none;
                    padding: var(--space-md) var(--space-xl);
                    border-radius: var(--radius-lg);
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all var(--transition-normal);
                    box-shadow: 0 4px 16px rgba(0, 102, 204, 0.3);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    min-height: var(--touch-target);
                }

                .route-stops-toggle:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
                }

                .route-stops-toggle:active {
                    transform: scale(0.98);
                    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.5);
                }

                .stops-categories {
                    padding: var(--space-lg);
                    background: var(--surface-hover);
                    border-bottom: 1px solid var(--border);
                }

                .category-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-lg);
                }

                .category-header h4 {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-emphasis);
                    margin: 0;
                }

                .buffer-control {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-primary);
                    background: var(--surface);
                    padding: var(--space-sm) var(--space-md);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                }

                .buffer-control input {
                    margin-left: var(--space-sm);
                    width: 80px;
                    accent-color: var(--primary);
                }

                .category-buttons {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: var(--space-md);
                    margin-bottom: var(--space-lg);
                }

                .category-btn {
                    background: var(--surface);
                    border: 2px solid var(--border);
                    padding: var(--space-lg);
                    border-radius: var(--radius-lg);
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--transition-normal);
                    text-align: center;
                    box-shadow: var(--shadow-sm);
                    min-height: var(--touch-target-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-primary);
                }

                .category-btn:hover {
                    border-color: var(--primary);
                    background: rgba(0, 102, 204, 0.1);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .category-btn.searching {
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    border-color: var(--primary);
                    color: white;
                    animation: pulse 2s infinite;
                }

                .custom-search {
                    display: flex;
                    gap: var(--space-md);
                }

                .custom-search input {
                    flex: 1;
                    padding: var(--space-md);
                    border: 2px solid var(--border);
                    border-radius: var(--radius-md);
                    font-size: 16px;
                    font-weight: 500;
                    background: var(--surface);
                    color: var(--text-primary);
                    min-height: var(--touch-target);
                    transition: all var(--transition-normal);
                }

                .custom-search input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.15);
                    background: var(--surface-hover);
                }

                .custom-search button {
                    padding: var(--space-md) var(--space-lg);
                    background: linear-gradient(135deg, var(--accent), #00d4aa);
                    color: white;
                    border: none;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 16px;
                    min-height: var(--touch-target);
                    transition: all var(--transition-normal);
                    box-shadow: 0 4px 16px rgba(0, 170, 136, 0.3);
                }

                .custom-search button:active {
                    transform: scale(0.98);
                    box-shadow: 0 2px 8px rgba(0, 170, 136, 0.5);
                }

                .route-stops-results {
                    background: var(--surface);
                    border-top: 1px solid var(--border);
                }

                .results-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-lg);
                    background: linear-gradient(135deg, rgba(34, 170, 68, 0.1), var(--surface-hover));
                    border-bottom: 1px solid var(--border);
                }

                .results-header h4 {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-emphasis);
                    margin: 0;
                }

                .close-results {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    font-size: 16px;
                    cursor: pointer;
                    padding: var(--space-sm);
                    color: var(--text-primary);
                    border-radius: var(--radius-full);
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all var(--transition-normal);
                }

                .close-results:hover {
                    background: var(--surface-hover);
                    transform: scale(1.1);
                }

                .close-results:active {
                    transform: scale(0.95);
                }

                .stops-list {
                    max-height: 400px;
                    overflow-y: auto;
                }

                .stop-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-lg);
                    border-bottom: 1px solid var(--border);
                    transition: all var(--transition-normal);
                    background: var(--surface);
                }

                .stop-item:hover {
                    background: var(--surface-hover);
                    transform: translateX(4px);
                }

                .stop-item:active {
                    transform: scale(0.98);
                }

                .stop-info {
                    flex: 1;
                }

                .stop-name {
                    font-weight: 700;
                    font-size: 16px;
                    color: var(--text-emphasis);
                    margin-bottom: var(--space-sm);
                }

                .stop-details {
                    display: flex;
                    gap: var(--space-md);
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--text-secondary);
                    flex-wrap: wrap;
                }

                .stop-rating {
                    color: var(--warning);
                    font-weight: 600;
                }

                .stop-actions {
                    display: flex;
                    gap: var(--space-sm);
                    flex-shrink: 0;
                }

                .stop-action {
                    padding: var(--space-sm) var(--space-md);
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    border: none;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 600;
                    color: white;
                    transition: all var(--transition-normal);
                    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3);
                    min-height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .stop-action:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
                }

                .stop-action:active {
                    transform: scale(0.95);
                    box-shadow: 0 1px 4px rgba(0, 102, 204, 0.5);
                }

                .loading-stops {
                    text-align: center;
                    padding: var(--space-2xl);
                    color: var(--text-primary);
                    font-weight: 600;
                    background: linear-gradient(135deg, rgba(0, 170, 136, 0.1), var(--surface-hover));
                    border-radius: var(--radius-lg);
                    margin: var(--space-lg);
                }

                @keyframes pulse {
                    0%, 100% { 
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }

                .searching {
                    animation: pulse 2s infinite;
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }

                .loading-stops.searching {
                    background: linear-gradient(
                        90deg,
                        rgba(0, 170, 136, 0.1),
                        rgba(0, 170, 136, 0.2),
                        rgba(0, 170, 136, 0.1)
                    );
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }
            </style>
        `;
    }

    setupEventListeners() {
        // Toggle stops search
        const toggleBtn = this.container.querySelector('#toggleRouteStops');
        const categoriesDiv = this.container.querySelector('#stopsCategories');
        
        toggleBtn.addEventListener('click', () => {
            const isVisible = categoriesDiv.style.display !== 'none';
            categoriesDiv.style.display = isVisible ? 'none' : 'block';
            toggleBtn.textContent = isVisible ? 'Find Great Stops' : 'Hide Search';
        });

        // Buffer range control
        const bufferRange = this.container.querySelector('#bufferRange');
        const bufferValue = this.container.querySelector('#bufferValue');
        
        bufferRange.addEventListener('input', (e) => {
            bufferValue.textContent = e.target.value;
        });

        // Category buttons
        const categoryBtns = this.container.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.searchCategory(category, parseFloat(bufferRange.value));
            });
        });

        // Custom search
        const customSearchBtn = this.container.querySelector('#customSearchBtn');
        const customSearchInput = this.container.querySelector('#customStopSearch');
        
        customSearchBtn.addEventListener('click', () => {
            const query = customSearchInput.value.trim();
            if (query) {
                this.searchCustom(query, parseFloat(bufferRange.value));
            }
        });

        customSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                customSearchBtn.click();
            }
        });

        // Close results
        const closeResults = this.container.querySelector('#closeResults');
        closeResults.addEventListener('click', () => {
            this.container.querySelector('#routeStopsResults').style.display = 'none';
        });
    }

    async searchCategory(category, bufferKm) {
        const queries = {
            'food': 'restaurants with great reviews',
            'scenic': 'scenic viewpoints and photo spots',
            'fuel': 'gas stations and EV charging',
            'attractions': 'tourist attractions and landmarks',
            'shopping': 'shopping centers and local stores',
            'rest': 'rest areas and accommodations'
        };

        await this.performSearch(queries[category] || category, bufferKm);
    }

    async searchCustom(query, bufferKm) {
        await this.performSearch(query, bufferKm);
    }

    async performSearch(query, bufferKm) {
        if (this.isSearching) return;
        
        this.isSearching = true;
        this.showSearching(query);
        
        try {
            // Use AI Orchestrator to find stops along route
            const response = await this.orchestrator.orchestrate(
                `Find ${query} along my route from ${this.routeData.origin.name} to ${this.routeData.destination.name}`,
                {
                    routeData: this.routeData,
                    intent: 'search_along_route',
                    bufferKm: bufferKm,
                    preferences: {
                        maxDetourMinutes: 5,
                        minRating: 4.0
                    }
                }
            );

            if (response.success && response.data.uiPayload?.items) {
                this.displayResults(response.data.uiPayload.items, query);
            } else {
                this.showError('No great stops found along this route. Try expanding the search radius.');
            }

        } catch (error) {
            console.error('Route stops search failed:', error);
            this.showError('Search failed. Please try again.');
        } finally {
            this.isSearching = false;
        }
    }

    showSearching(query) {
        const resultsDiv = this.container.querySelector('#routeStopsResults');
        const resultsTitle = this.container.querySelector('#resultsTitle');
        const stopsList = this.container.querySelector('#stopsList');
        
        resultsTitle.textContent = `Finding ${query} along your route...`;
        stopsList.innerHTML = `
            <div class="loading-stops searching">
                🔍 Analyzing your route for the best stops...<br>
                <small>This may take a moment</small>
            </div>
        `;
        
        resultsDiv.style.display = 'block';
    }

    displayResults(stops, query) {
        const resultsTitle = this.container.querySelector('#resultsTitle');
        const stopsList = this.container.querySelector('#stopsList');
        
        resultsTitle.textContent = `Found ${stops.length} great stops for ${query}`;
        
        if (stops.length === 0) {
            stopsList.innerHTML = `
                <div class="loading-stops">
                    No stops found. Try a different search or increase the radius.
                </div>
            `;
            return;
        }

        stopsList.innerHTML = stops.map(stop => `
            <div class="stop-item" data-place-id="${stop.place_id}">
                <div class="stop-info">
                    <div class="stop-name">${stop.name}</div>
                    <div class="stop-details">
                        <span class="stop-rating">⭐ ${stop.rating || 'N/A'}</span>
                        <span class="stop-detour">+${stop.detourInfo?.additionalMinutes || '?'} min</span>
                        <span class="stop-distance">${this.formatDistance(stop.distance || 0)}</span>
                        ${stop.opening_hours?.open_now ? '<span class="stop-open">🟢 Open</span>' : ''}
                    </div>
                </div>
                <div class="stop-actions">
                    <button class="stop-action" onclick="window.roamwiseApp.addToRoute('${stop.place_id}')">
                        📍 Add Stop
                    </button>
                    <button class="stop-action" onclick="window.roamwiseApp.showOnMap('${stop.place_id}')">
                        🗺️ View
                    </button>
                </div>
            </div>
        `).join('');

        this.currentStops = stops;
    }

    showError(message) {
        const stopsList = this.container.querySelector('#stopsList');
        stopsList.innerHTML = `
            <div class="loading-stops" style="color: var(--error-600);">
                ❌ ${message}
            </div>
        `;
    }

    formatDistance(meters) {
        if (meters < 1000) {
            return `${Math.round(meters)}m`;
        } else {
            return `${(meters / 1000).toFixed(1)}km`;
        }
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }

    // Public API
    updateRoute(newRouteData) {
        this.routeData = newRouteData;
        this.render();
        this.setupEventListeners();
    }

    getCurrentStops() {
        return this.currentStops;
    }

    addStopToRoute(placeId) {
        const stop = this.currentStops.find(s => s.place_id === placeId);
        if (stop) {
            // Trigger route recalculation with the new stop
            window.roamwiseApp.addWaypointToRoute(stop);
        }
    }
}

// Export for use in main app
window.RouteStopsUI = RouteStopsUI;
export default RouteStopsUI;