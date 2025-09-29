/**
 * Rain Plan Toggle Component
 * Automatically switches between outdoor and indoor itineraries based on weather
 * 
 * Features:
 * - Weather-aware planning
 * - One-click rain plan toggle
 * - Indoor alternatives suggestion
 * - Smart venue categorization
 */

class RainPlan {
    constructor() {
        this.isRainPlanActive = false;
        this.originalPlan = null;
        this.rainPlan = null;
        this.weatherThreshold = 50; // 50% precipitation probability
        this.indoorVenueTypes = [
            'museum',
            'art_gallery',
            'shopping_mall',
            'movie_theater',
            'aquarium',
            'library',
            'spa',
            'restaurant',
            'cafe',
            'bar',
            'casino',
            'bowling_alley',
            'gym',
            'store',
            'department_store',
            'book_store',
            'electronics_store',
            'clothing_store'
        ];
        
        this.outdoorVenueTypes = [
            'park',
            'tourist_attraction',
            'amusement_park',
            'zoo',
            'beach',
            'stadium',
            'campground',
            'rv_park',
            'natural_feature',
            'hiking_area',
            'golf_course',
            'marina'
        ];
        
        this.init();
    }

    /**
     * Initialize the rain plan system
     */
    init() {
        this.createRainPlanToggle();
        this.addStyles();
        this.setupEventListeners();
        console.log('☔ Rain Plan system initialized');
    }

    /**
     * Create the rain plan toggle UI
     */
    createRainPlanToggle() {
        // Remove existing toggle if present
        const existingToggle = document.getElementById('rain-plan-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggleHTML = `
            <div id="rain-plan-toggle" class="rain-plan-toggle">
                <div class="rain-toggle-container">
                    <div class="weather-indicator" id="weatherIndicator">
                        <span class="weather-icon">☀️</span>
                        <span class="weather-text">Clear</span>
                    </div>
                    
                    <div class="toggle-switch-container">
                        <label class="toggle-switch" for="rainPlanSwitch">
                            <input type="checkbox" id="rainPlanSwitch" />
                            <span class="toggle-slider">
                                <span class="toggle-icon outdoor">☀️</span>
                                <span class="toggle-icon indoor">☔</span>
                            </span>
                        </label>
                        <div class="toggle-labels">
                            <span class="toggle-label outdoor">Outdoor Plan</span>
                            <span class="toggle-label indoor">Rain Plan</span>
                        </div>
                    </div>
                    
                    <div class="rain-plan-info" id="rainPlanInfo">
                        <div class="plan-status" id="planStatus">
                            <span class="status-icon">☀️</span>
                            <span class="status-text">Perfect weather for outdoor activities</span>
                        </div>
                        <div class="plan-details" id="planDetails">
                            <span class="details-text">All activities are weather-appropriate</span>
                        </div>
                    </div>
                </div>
                
                <div class="rain-plan-suggestions" id="rainPlanSuggestions" style="display: none;">
                    <h4 class="suggestions-title">🏢 Indoor Alternatives</h4>
                    <div class="suggestions-list" id="suggestionsList">
                        <!-- Dynamic suggestions will be populated here -->
                    </div>
                    <button class="apply-suggestions-btn" id="applySuggestionsBtn">
                        Apply Indoor Plan
                    </button>
                </div>
            </div>
        `;

        // Find a good place to insert the toggle (after search or in header)
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.insertAdjacentHTML('afterend', toggleHTML);
        } else {
            document.body.insertAdjacentHTML('beforeend', toggleHTML);
        }
    }

    /**
     * Update weather information and auto-suggest rain plan
     */
    updateWeather(weatherData) {
        if (!weatherData) return;

        const indicator = document.getElementById('weatherIndicator');
        const planStatus = document.getElementById('planStatus');
        const planDetails = document.getElementById('planDetails');
        const suggestions = document.getElementById('rainPlanSuggestions');

        if (!indicator || !planStatus || !planDetails || !suggestions) return;

        const precipitationProbability = weatherData.precipitation_probability || 0;
        const temperature = weatherData.temperature || 20;
        const conditions = weatherData.conditions || 'clear';

        // Update weather indicator
        const weatherIcon = this.getWeatherIcon(precipitationProbability, conditions);
        const weatherText = this.getWeatherText(precipitationProbability, conditions);
        
        indicator.innerHTML = `
            <span class="weather-icon">${weatherIcon}</span>
            <span class="weather-text">${weatherText}</span>
            <span class="weather-temp">${Math.round(temperature)}°</span>
        `;

        // Update plan status
        const shouldSuggestRainPlan = precipitationProbability >= this.weatherThreshold;
        
        if (shouldSuggestRainPlan) {
            planStatus.innerHTML = `
                <span class="status-icon">⚠️</span>
                <span class="status-text">Rain expected - consider indoor alternatives</span>
            `;
            planDetails.innerHTML = `
                <span class="details-text">${precipitationProbability}% chance of precipitation</span>
            `;
            
            // Show suggestions
            this.generateIndoorSuggestions();
            suggestions.style.display = 'block';
            
            // Auto-enable rain plan if very high precipitation
            if (precipitationProbability >= 80 && !this.isRainPlanActive) {
                this.showRainPlanNotification();
            }
        } else {
            planStatus.innerHTML = `
                <span class="status-icon">☀️</span>
                <span class="status-text">Great weather for outdoor activities</span>
            `;
            planDetails.innerHTML = `
                <span class="details-text">Only ${precipitationProbability}% chance of rain</span>
            `;
            
            suggestions.style.display = 'none';
        }

        // Update toggle appearance based on weather
        const toggleContainer = document.querySelector('.rain-plan-toggle');
        if (toggleContainer) {
            toggleContainer.classList.toggle('weather-warning', shouldSuggestRainPlan);
        }
    }

    /**
     * Generate indoor alternatives for current plan
     */
    async generateIndoorSuggestions() {
        const suggestionsList = document.getElementById('suggestionsList');
        if (!suggestionsList) return;

        // Get current search results or plan
        const currentResults = this.getCurrentResults();
        const indoorAlternatives = await this.findIndoorAlternatives(currentResults);

        if (indoorAlternatives.length === 0) {
            suggestionsList.innerHTML = `
                <div class="no-suggestions">
                    <span class="no-suggestions-icon">🤷‍♀️</span>
                    <span class="no-suggestions-text">No indoor alternatives found in this area</span>
                </div>
            `;
            return;
        }

        suggestionsList.innerHTML = indoorAlternatives.slice(0, 4).map(place => `
            <div class="suggestion-item" data-place-id="${place.place_id}">
                <div class="suggestion-icon">${this.getIndoorIcon(place.types)}</div>
                <div class="suggestion-info">
                    <div class="suggestion-name">${place.name}</div>
                    <div class="suggestion-type">${this.formatPlaceType(place.types?.[0])}</div>
                    <div class="suggestion-rating">
                        ⭐ ${place.rating ? place.rating.toFixed(1) : 'N/A'}
                        ${place.distance ? `• ${this.formatDistance(place.distance)}` : ''}
                    </div>
                </div>
                <button class="add-suggestion-btn" onclick="window.rainPlan?.addToRainPlan('${place.place_id}')">
                    <span>+</span>
                </button>
            </div>
        `).join('');
    }

    /**
     * Find indoor alternatives for given locations
     */
    async findIndoorAlternatives(currentResults) {
        if (!currentResults || currentResults.length === 0) {
            return await this.searchNearbyIndoorVenues();
        }

        const indoorAlternatives = [];
        
        for (const result of currentResults) {
            if (this.isOutdoorVenue(result)) {
                // Find indoor alternatives near this outdoor venue
                const alternatives = await this.searchIndoorNear(result);
                indoorAlternatives.push(...alternatives);
            }
        }

        // Remove duplicates and sort by rating
        const uniqueAlternatives = indoorAlternatives.filter((place, index, self) => 
            index === self.findIndex(p => p.place_id === place.place_id)
        );

        return uniqueAlternatives.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    /**
     * Search for indoor venues near a specific location
     */
    async searchIndoorNear(location) {
        const query = 'museums galleries shopping malls entertainment indoor activities';
        
        try {
            // Use the app's AI system to search for indoor venues
            if (window.app?.aiOrchestrator) {
                const response = await window.app.aiOrchestrator.tools.get('places')({
                    query,
                    location: location.geometry?.location || { lat: 0, lng: 0 },
                    filters: {
                        types: this.indoorVenueTypes,
                        radius: 5000
                    }
                });
                
                return response.items || [];
            }
        } catch (error) {
            console.warn('Failed to search indoor venues:', error);
        }
        
        return [];
    }

    /**
     * Search for nearby indoor venues in general area
     */
    async searchNearbyIndoorVenues() {
        const userLocation = window.app?.userLocation;
        if (!userLocation) return [];

        const query = 'indoor activities museums shopping malls entertainment';
        
        try {
            if (window.app?.aiOrchestrator) {
                const response = await window.app.aiOrchestrator.tools.get('places')({
                    query,
                    location: userLocation,
                    filters: {
                        types: this.indoorVenueTypes,
                        radius: 10000
                    }
                });
                
                return response.items || [];
            }
        } catch (error) {
            console.warn('Failed to search nearby indoor venues:', error);
        }
        
        return [];
    }

    /**
     * Toggle between outdoor and rain plans
     */
    toggleRainPlan() {
        const switchElement = document.getElementById('rainPlanSwitch');
        if (!switchElement) return;

        this.isRainPlanActive = switchElement.checked;
        
        if (this.isRainPlanActive) {
            this.activateRainPlan();
        } else {
            this.deactivateRainPlan();
        }
        
        this.updateToggleDisplay();
    }

    /**
     * Activate rain plan mode
     */
    activateRainPlan() {
        console.log('☔ Activating Rain Plan');
        
        // Store current plan as original
        this.originalPlan = this.getCurrentResults();
        
        // Generate and apply rain plan
        this.applyRainPlan();
        
        // Show notification
        window.app?.showNotification('Rain Plan activated - showing indoor alternatives', 'info');
    }

    /**
     * Deactivate rain plan and restore original
     */
    deactivateRainPlan() {
        console.log('☀️ Deactivating Rain Plan');
        
        if (this.originalPlan) {
            this.restoreOriginalPlan();
        }
        
        window.app?.showNotification('Switched back to outdoor plan', 'info');
    }

    /**
     * Apply the rain plan by filtering/replacing outdoor venues
     */
    async applyRainPlan() {
        const currentResults = this.getCurrentResults();
        if (!currentResults) return;

        const rainPlanResults = [];
        
        // Process each result
        for (const result of currentResults) {
            if (this.isIndoorVenue(result)) {
                // Keep indoor venues
                rainPlanResults.push({
                    ...result,
                    rainPlanOriginal: false
                });
            } else if (this.isOutdoorVenue(result)) {
                // Replace outdoor venues with indoor alternatives
                const alternatives = await this.searchIndoorNear(result);
                if (alternatives.length > 0) {
                    rainPlanResults.push({
                        ...alternatives[0],
                        rainPlanReplacement: true,
                        replacedVenue: result.name
                    });
                } else {
                    // Keep outdoor venue but mark as weather-dependent
                    rainPlanResults.push({
                        ...result,
                        weatherWarning: true
                    });
                }
            } else {
                // Keep ambiguous venues
                rainPlanResults.push(result);
            }
        }

        this.rainPlan = rainPlanResults;
        this.displayRainPlan(rainPlanResults);
    }

    /**
     * Display the rain plan results
     */
    displayRainPlan(rainPlanResults) {
        // Update results display with rain plan
        if (window.app?.displayResults) {
            window.app.displayResults(rainPlanResults, {
                title: '☔ Rain Plan Active',
                subtitle: 'Indoor-friendly itinerary for weather protection',
                type: 'rain_plan'
            });
        }
    }

    /**
     * Restore original outdoor plan
     */
    restoreOriginalPlan() {
        if (this.originalPlan && window.app?.displayResults) {
            window.app.displayResults(this.originalPlan, {
                title: '☀️ Outdoor Plan',
                subtitle: 'Weather-appropriate outdoor activities',
                type: 'outdoor_plan'
            });
        }
    }

    /**
     * Check if a venue is primarily indoor
     */
    isIndoorVenue(place) {
        if (!place.types) return false;
        return place.types.some(type => this.indoorVenueTypes.includes(type));
    }

    /**
     * Check if a venue is primarily outdoor
     */
    isOutdoorVenue(place) {
        if (!place.types) return false;
        return place.types.some(type => this.outdoorVenueTypes.includes(type));
    }

    /**
     * Get current search results or itinerary
     */
    getCurrentResults() {
        // Try to get from last AI response
        if (window.app?.lastAIResponse?.data?.uiPayload?.items) {
            return window.app.lastAIResponse.data.uiPayload.items;
        }
        
        // Try to get from DOM
        const resultsContainer = document.getElementById('results');
        if (resultsContainer) {
            // Extract results from DOM if needed
            const resultItems = resultsContainer.querySelectorAll('.result-item');
            return Array.from(resultItems).map(item => {
                try {
                    return JSON.parse(item.dataset.placeData || '{}');
                } catch {
                    return null;
                }
            }).filter(Boolean);
        }
        
        return [];
    }

    /**
     * Add a place to the rain plan
     */
    addToRainPlan(placeId) {
        console.log('Adding to rain plan:', placeId);
        
        // Implementation would add the place to current rain plan
        // This could integrate with the compare tray or save functionality
        
        window.app?.showNotification('Added to rain plan', 'success');
    }

    /**
     * Show notification suggesting rain plan activation
     */
    showRainPlanNotification() {
        const notification = document.createElement('div');
        notification.className = 'rain-plan-notification';
        notification.innerHTML = `
            <div class="rain-notification-content">
                <span class="rain-notification-icon">☔</span>
                <div class="rain-notification-text">
                    <div class="rain-notification-title">Heavy rain expected!</div>
                    <div class="rain-notification-subtitle">Switch to indoor alternatives?</div>
                </div>
                <div class="rain-notification-actions">
                    <button class="rain-notification-btn primary" onclick="this.closest('.rain-plan-notification').remove(); window.rainPlan?.activateRainPlan();">
                        Switch to Rain Plan
                    </button>
                    <button class="rain-notification-btn secondary" onclick="this.closest('.rain-plan-notification').remove();">
                        Keep Outdoor Plan
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Toggle switch event
        document.addEventListener('change', (e) => {
            if (e.target.id === 'rainPlanSwitch') {
                this.toggleRainPlan();
            }
        });

        // Apply suggestions button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'applySuggestionsBtn') {
                this.applyRainPlan();
            }
        });
    }

    /**
     * Update toggle display based on current state
     */
    updateToggleDisplay() {
        const toggle = document.querySelector('.rain-plan-toggle');
        if (toggle) {
            toggle.classList.toggle('rain-plan-active', this.isRainPlanActive);
        }
    }

    /**
     * Utility methods
     */
    getWeatherIcon(precipitation, conditions) {
        if (precipitation >= 80) return '🌧️';
        if (precipitation >= 50) return '☁️';
        if (precipitation >= 20) return '⛅';
        return '☀️';
    }

    getWeatherText(precipitation, conditions) {
        if (precipitation >= 80) return 'Heavy Rain';
        if (precipitation >= 50) return 'Rain Likely';
        if (precipitation >= 20) return 'Partly Cloudy';
        return 'Clear';
    }

    getIndoorIcon(types) {
        if (!types || types.length === 0) return '🏢';
        
        const iconMap = {
            'museum': '🏛️',
            'art_gallery': '🎨',
            'shopping_mall': '🛍️',
            'movie_theater': '🎬',
            'aquarium': '🐠',
            'library': '📚',
            'spa': '🧖‍♀️',
            'restaurant': '🍽️',
            'cafe': '☕',
            'bar': '🍸',
            'casino': '🎰',
            'bowling_alley': '🎳',
            'gym': '💪'
        };
        
        return iconMap[types[0]] || '🏢';
    }

    formatPlaceType(type) {
        return type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Place';
    }

    formatDistance(distance) {
        if (distance < 1000) return `${Math.round(distance)}m`;
        return `${(distance / 1000).toFixed(1)}km`;
    }

    /**
     * Add CSS styles for rain plan components
     */
    addStyles() {
        if (document.getElementById('rain-plan-styles')) return;

        const style = document.createElement('style');
        style.id = 'rain-plan-styles';
        style.textContent = `
            .rain-plan-toggle {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
                backdrop-filter: blur(20px);
                border: 1px solid rgba(0, 122, 255, 0.2);
                border-radius: 16px;
                padding: 20px;
                margin: 16px 0;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }

            .rain-plan-toggle.weather-warning {
                border-color: rgba(255, 193, 7, 0.5);
                background: linear-gradient(135deg, rgba(255, 248, 225, 0.95), rgba(255, 252, 240, 0.95));
                box-shadow: 0 8px 32px rgba(255, 193, 7, 0.2);
            }

            .rain-plan-toggle.rain-plan-active {
                border-color: rgba(0, 123, 255, 0.6);
                background: linear-gradient(135deg, rgba(230, 244, 255, 0.95), rgba(240, 248, 255, 0.95));
            }

            .rain-toggle-container {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .weather-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 10px;
                border: 1px solid rgba(0, 122, 255, 0.1);
                font-size: 14px;
                font-weight: 600;
            }

            .weather-icon {
                font-size: 18px;
            }

            .weather-text {
                color: var(--text-primary);
            }

            .weather-temp {
                color: var(--text-secondary);
                font-size: 12px;
                margin-left: auto;
            }

            .toggle-switch-container {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 30px;
            }

            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #22aa44, #28a745);
                border-radius: 30px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 2px;
            }

            .toggle-slider:before {
                content: "";
                position: absolute;
                height: 26px;
                width: 26px;
                left: 2px;
                background: white;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            input:checked + .toggle-slider {
                background: linear-gradient(135deg, #007aff, #0056b3);
            }

            input:checked + .toggle-slider:before {
                transform: translateX(30px);
            }

            .toggle-icon {
                font-size: 12px;
                z-index: 1;
                transition: opacity 0.3s ease;
            }

            .toggle-icon.outdoor {
                margin-left: 4px;
            }

            .toggle-icon.indoor {
                margin-right: 4px;
                opacity: 0.6;
            }

            input:checked + .toggle-slider .toggle-icon.outdoor {
                opacity: 0.6;
            }

            input:checked + .toggle-slider .toggle-icon.indoor {
                opacity: 1;
            }

            .toggle-labels {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .toggle-label {
                font-size: 12px;
                font-weight: 600;
                transition: color 0.3s ease;
            }

            .toggle-label.outdoor {
                color: #22aa44;
            }

            .toggle-label.indoor {
                color: #007aff;
                opacity: 0.6;
            }

            .rain-plan-active .toggle-label.outdoor {
                opacity: 0.6;
            }

            .rain-plan-active .toggle-label.indoor {
                opacity: 1;
            }

            .rain-plan-info {
                background: rgba(255, 255, 255, 0.6);
                border-radius: 12px;
                padding: 12px;
                border: 1px solid rgba(0, 122, 255, 0.1);
            }

            .plan-status {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
            }

            .status-icon {
                font-size: 16px;
            }

            .status-text {
                font-size: 13px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .plan-details {
                font-size: 12px;
                color: var(--text-secondary);
                margin-left: 24px;
            }

            .rain-plan-suggestions {
                margin-top: 16px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 12px;
                padding: 16px;
                border: 1px solid rgba(0, 122, 255, 0.2);
            }

            .suggestions-title {
                margin: 0 0 12px 0;
                font-size: 14px;
                font-weight: 700;
                color: var(--text-primary);
            }

            .suggestions-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 12px;
            }

            .suggestion-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 8px;
                border: 1px solid rgba(0, 122, 255, 0.1);
                transition: all 0.2s ease;
            }

            .suggestion-item:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .suggestion-icon {
                font-size: 20px;
                flex-shrink: 0;
            }

            .suggestion-info {
                flex: 1;
            }

            .suggestion-name {
                font-size: 13px;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 2px;
            }

            .suggestion-type {
                font-size: 11px;
                color: var(--text-secondary);
                margin-bottom: 2px;
            }

            .suggestion-rating {
                font-size: 10px;
                color: var(--text-secondary);
            }

            .add-suggestion-btn {
                background: rgba(0, 122, 255, 0.1);
                color: var(--primary);
                border: 1px solid rgba(0, 122, 255, 0.3);
                border-radius: 6px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: bold;
            }

            .add-suggestion-btn:hover {
                background: var(--primary);
                color: white;
            }

            .apply-suggestions-btn {
                width: 100%;
                padding: 10px;
                background: linear-gradient(135deg, var(--primary), var(--accent));
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .apply-suggestions-btn:hover {
                transform: scale(1.02);
                box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
            }

            .no-suggestions {
                text-align: center;
                padding: 20px;
                color: var(--text-secondary);
                font-size: 12px;
            }

            .no-suggestions-icon {
                font-size: 24px;
                display: block;
                margin-bottom: 8px;
            }

            .rain-plan-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 193, 7, 0.5);
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                max-width: 320px;
                animation: slideInRight 0.3s ease-out;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .rain-notification-content {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .rain-notification-icon {
                font-size: 24px;
                text-align: center;
            }

            .rain-notification-title {
                font-size: 14px;
                font-weight: 700;
                color: var(--text-primary);
            }

            .rain-notification-subtitle {
                font-size: 12px;
                color: var(--text-secondary);
            }

            .rain-notification-actions {
                display: flex;
                gap: 8px;
            }

            .rain-notification-btn {
                flex: 1;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .rain-notification-btn.primary {
                background: linear-gradient(135deg, var(--primary), var(--accent));
                color: white;
                border: none;
            }

            .rain-notification-btn.secondary {
                background: rgba(108, 117, 125, 0.1);
                color: #6c757d;
                border: 1px solid rgba(108, 117, 125, 0.3);
            }

            .rain-notification-btn:hover {
                transform: scale(1.05);
            }

            @media (max-width: 768px) {
                .rain-plan-toggle {
                    padding: 16px;
                    margin: 12px 0;
                }

                .toggle-switch-container {
                    flex-direction: column;
                    gap: 8px;
                    align-items: center;
                }

                .suggestion-item {
                    padding: 8px;
                }

                .rain-plan-notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Export for use in app
window.RainPlan = RainPlan;
export default RainPlan;