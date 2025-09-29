/**
 * Route Corridor Search
 * "Search along route" - finds great stops with zero detours
 * 
 * Generates a polyline corridor (1-3km buffer) and searches for places
 * along the planned route for maximum travel efficiency and delight.
 */

class RouteCorridorSearch {
    constructor(googleMapsAPIKey) {
        this.googleMapsAPIKey = googleMapsAPIKey;
        this.defaultBufferKm = 2; // 2km corridor each side of route
        this.maxDetourMinutes = 5; // Maximum acceptable detour
    }

    /**
     * Find places along a route within specified corridor
     */
    async searchAlongRoute(routePolyline, searchQuery, options = {}) {
        const {
            bufferKm = this.defaultBufferKm,
            maxResults = 10,
            categories = ['food', 'gas_station', 'tourist_attraction', 'viewpoint'],
            minRating = 4.0
        } = options;

        console.log(`🛣️ Searching for "${searchQuery}" along route with ${bufferKm}km buffer`);

        try {
            // 1. Decode polyline and create corridor points
            const routePoints = this.decodePolyline(routePolyline);
            const corridorBounds = this.generateCorridorBounds(routePoints, bufferKm);
            
            // 2. Search for places within corridor
            const candidatePlaces = await this.searchInCorridor(
                corridorBounds, 
                searchQuery, 
                categories, 
                minRating
            );

            // 3. Filter by actual detour time (not just distance)
            const filteredPlaces = await this.filterByDetourTime(
                candidatePlaces, 
                routePoints, 
                this.maxDetourMinutes
            );

            // 4. Rank by combination of rating, minimal detour, and relevance
            const rankedPlaces = this.rankCorridorPlaces(filteredPlaces, routePoints);

            console.log(`✅ Found ${rankedPlaces.length} great stops along route`);

            return {
                success: true,
                places: rankedPlaces.slice(0, maxResults),
                metadata: {
                    originalRoute: routePolyline,
                    corridorBufferKm: bufferKm,
                    totalCandidates: candidatePlaces.length,
                    filteredByDetour: filteredPlaces.length,
                    searchQuery,
                    processingTime: Date.now() - this.startTime
                }
            };

        } catch (error) {
            console.error('❌ Route corridor search failed:', error);
            return {
                success: false,
                error: error.message,
                places: []
            };
        }
    }

    /**
     * Decode Google Maps polyline into lat/lng points
     */
    decodePolyline(polyline) {
        const points = [];
        let index = 0;
        let lat = 0;
        let lng = 0;

        while (index < polyline.length) {
            let shift = 0;
            let result = 0;
            let byte;

            // Decode latitude
            do {
                byte = polyline.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += deltaLat;

            shift = 0;
            result = 0;

            // Decode longitude
            do {
                byte = polyline.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += deltaLng;

            points.push({
                lat: lat / 1e5,
                lng: lng / 1e5
            });
        }

        return points;
    }

    /**
     * Generate corridor bounds for searching
     * Creates multiple search circles along the route
     */
    generateCorridorBounds(routePoints, bufferKm) {
        const bounds = [];
        const stepSize = Math.max(1, Math.floor(routePoints.length / 20)); // Max 20 search circles
        
        for (let i = 0; i < routePoints.length; i += stepSize) {
            const point = routePoints[i];
            bounds.push({
                center: point,
                radiusKm: bufferKm,
                routeIndex: i // Track position along route
            });
        }

        return bounds;
    }

    /**
     * Search for places within corridor bounds
     */
    async searchInCorridor(corridorBounds, searchQuery, categories, minRating) {
        const allPlaces = new Map(); // Use Map to deduplicate by place_id
        
        // Search in each corridor segment
        for (const bound of corridorBounds) {
            try {
                const places = await this.nearbySearch({
                    location: bound.center,
                    radius: bound.radiusKm * 1000, // Convert to meters
                    keyword: searchQuery,
                    types: categories,
                    minRating: minRating
                });

                places.forEach(place => {
                    if (!allPlaces.has(place.place_id)) {
                        // Add route context
                        place.routeContext = {
                            nearestRouteIndex: bound.routeIndex,
                            corridorCenter: bound.center
                        };
                        allPlaces.set(place.place_id, place);
                    }
                });

            } catch (error) {
                console.warn(`Search failed for bound ${bound.center.lat}, ${bound.center.lng}:`, error);
            }
        }

        return Array.from(allPlaces.values());
    }

    /**
     * Filter places by actual detour time using Directions API
     */
    async filterByDetourTime(places, routePoints, maxDetourMinutes) {
        const filteredPlaces = [];
        const origin = routePoints[0];
        const destination = routePoints[routePoints.length - 1];

        // Get original route time
        const originalRoute = await this.getDirections(origin, destination);
        const originalDurationMinutes = originalRoute.duration / 60;

        // Check detour for each place (batch processing for efficiency)
        const batchSize = 5;
        for (let i = 0; i < places.length; i += batchSize) {
            const batch = places.slice(i, i + batchSize);
            
            const detourPromises = batch.map(async (place) => {
                try {
                    // Route: Origin → Place → Destination
                    const detourRoute = await this.getDirections(
                        origin, 
                        destination, 
                        [place.geometry.location]
                    );
                    
                    const detourDurationMinutes = detourRoute.duration / 60;
                    const additionalTime = detourDurationMinutes - originalDurationMinutes;
                    
                    if (additionalTime <= maxDetourMinutes) {
                        place.detourInfo = {
                            additionalMinutes: Math.round(additionalTime),
                            originalDuration: Math.round(originalDurationMinutes),
                            detourDuration: Math.round(detourDurationMinutes),
                            efficiency: 1 - (additionalTime / originalDurationMinutes)
                        };
                        return place;
                    }
                } catch (error) {
                    console.warn(`Detour calculation failed for ${place.name}:`, error);
                }
                return null;
            });

            const batchResults = await Promise.all(detourPromises);
            filteredPlaces.push(...batchResults.filter(place => place !== null));
        }

        return filteredPlaces;
    }

    /**
     * Rank corridor places by multiple factors
     */
    rankCorridorPlaces(places, routePoints) {
        return places.map(place => {
            let score = 0;
            
            // Base Google rating (40%)
            score += 0.4 * (place.rating || 3.5);
            
            // Popularity (20%)
            score += 0.2 * Math.min(Math.log10(place.user_ratings_total || 1), 4) / 4;
            
            // Detour efficiency (25%) - less detour is better
            const efficiency = place.detourInfo?.efficiency || 0.5;
            score += 0.25 * efficiency;
            
            // Route position bonus (15%) - mid-route stops are better
            const routePosition = place.routeContext?.nearestRouteIndex || 0;
            const midRouteBonus = 1 - Math.abs((routePosition / routePoints.length) - 0.5) * 2;
            score += 0.15 * midRouteBonus;
            
            place.corridorScore = Math.max(0, Math.min(5, score));
            place.scoreBreakdown = {
                rating: place.rating || 3.5,
                popularity: Math.min(Math.log10(place.user_ratings_total || 1), 4) / 4,
                efficiency: efficiency,
                routePosition: midRouteBonus
            };
            
            return place;
        }).sort((a, b) => b.corridorScore - a.corridorScore);
    }

    /**
     * Nearby search using Google Places API
     */
    async nearbySearch(params) {
        const { location, radius, keyword, types, minRating } = params;
        
        // This would call the actual Google Places API
        // For now, return mock data structure
        const response = await fetch('/api/places/nearby', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                location: `${location.lat},${location.lng}`,
                radius,
                keyword,
                type: types?.[0],
                minprice: 0,
                maxprice: 4
            })
        });

        const data = await response.json();
        if (!data.ok) throw new Error(data.error);
        
        return data.results?.filter(place => 
            !minRating || (place.rating >= minRating)
        ) || [];
    }

    /**
     * Get directions with optional waypoints
     */
    async getDirections(origin, destination, waypoints = []) {
        const response = await fetch('/api/directions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                origin: `${origin.lat},${origin.lng}`,
                destination: `${destination.lat},${destination.lng}`,
                waypoints: waypoints.map(wp => `${wp.lat},${wp.lng}`),
                optimize: false,
                mode: 'driving'
            })
        });

        const data = await response.json();
        if (!data.ok) throw new Error(data.error);
        
        return {
            duration: data.routes[0]?.legs?.reduce((sum, leg) => sum + leg.duration.value, 0) || 0,
            distance: data.routes[0]?.legs?.reduce((sum, leg) => sum + leg.distance.value, 0) || 0,
            polyline: data.routes[0]?.overview_polyline?.points || ''
        };
    }

    /**
     * Generate corridor visualization data for map display
     */
    generateCorridorVisualization(routePoints, bufferKm) {
        const corridorPolygon = [];
        const earthRadius = 6371; // km
        
        routePoints.forEach(point => {
            // Create a rough polygon around each point
            const lat = point.lat * Math.PI / 180;
            const lng = point.lng * Math.PI / 180;
            
            // Simple circular approximation for corridor bounds
            const latOffset = bufferKm / earthRadius * 180 / Math.PI;
            const lngOffset = bufferKm / earthRadius * 180 / Math.PI / Math.cos(lat);
            
            corridorPolygon.push([
                { lat: point.lat + latOffset, lng: point.lng + lngOffset },
                { lat: point.lat + latOffset, lng: point.lng - lngOffset },
                { lat: point.lat - latOffset, lng: point.lng - lngOffset },
                { lat: point.lat - latOffset, lng: point.lng + lngOffset }
            ]);
        });
        
        return corridorPolygon;
    }

    /**
     * Get predefined categories for different search types
     */
    static getSearchCategories(searchType) {
        const categories = {
            'food': ['restaurant', 'cafe', 'bakery', 'meal_takeaway'],
            'fuel': ['gas_station', 'charging_station'],
            'attractions': ['tourist_attraction', 'museum', 'park', 'zoo'],
            'scenic': ['scenic_overlook', 'park', 'natural_feature'],
            'services': ['bank', 'atm', 'pharmacy', 'hospital'],
            'shopping': ['shopping_mall', 'store', 'supermarket'],
            'rest': ['lodging', 'rv_park', 'rest_area']
        };
        
        return categories[searchType] || ['point_of_interest'];
    }
}

// Export for use in orchestrator
export default RouteCorridorSearch;