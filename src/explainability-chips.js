/**
 * Explainability Chips Component
 * Shows AI reasoning and scoring breakdown for recommendations
 * 
 * Provides transparency into how the AI Orchestrator makes decisions
 */

class ExplainabilityChips {
    constructor() {
        this.chipTypes = {
            'high_rating': { icon: '⭐', label: 'Highly Rated', color: '#22aa44' },
            'popular': { icon: '🔥', label: 'Popular Choice', color: '#ff8800' },
            'weather_perfect': { icon: '☀️', label: 'Perfect Weather', color: '#0066cc' },
            'weather_good': { icon: '🌤️', label: 'Good Weather', color: '#00aa88' },
            'weather_indoor': { icon: '🏢', label: 'Indoor Option', color: '#6c757d' },
            'close_by': { icon: '📍', label: 'Nearby', color: '#00aa88' },
            'interest_match': { icon: '💝', label: 'Matches Interests', color: '#e83e8c' },
            'novelty': { icon: '✨', label: 'New Experience', color: '#6f42c1' },
            'anchor': { icon: '⚓', label: 'Must-Do Experience', color: '#dc3545' },
            'filler': { icon: '🔗', label: 'Supporting Activity', color: '#6c757d' },
            'route_optimized': { icon: '🛣️', label: 'Route Optimized', color: '#0066cc' },
            'time_efficient': { icon: '⚡', label: 'Time Efficient', color: '#ff8800' },
            'budget_friendly': { icon: '💰', label: 'Budget Friendly', color: '#22aa44' },
            'premium': { icon: '👑', label: 'Premium Experience', color: '#6f42c1' }
        };
    }

    /**
     * Generate explainability chips for a place/recommendation
     */
    generateChips(place, context = {}) {
        const chips = [];
        
        // Rating-based chips
        if (place.rating >= 4.5) {
            chips.push(this.createChip('high_rating', `${place.rating}/5.0`));
        }
        
        // Popularity chips
        if (place.user_ratings_total && place.user_ratings_total > 1000) {
            chips.push(this.createChip('popular', `${this.formatNumber(place.user_ratings_total)} reviews`));
        }
        
        // Weather compatibility
        if (context.weather) {
            const weatherChip = this.getWeatherChip(place, context.weather);
            if (weatherChip) chips.push(weatherChip);
        }
        
        // Distance/location chips
        if (place.distance && place.distance < 1000) {
            chips.push(this.createChip('close_by', `${Math.round(place.distance)}m away`));
        }
        
        // Interest matching
        if (place.interestScore && place.interestScore > 0.7) {
            chips.push(this.createChip('interest_match', 'Perfect match'));
        }
        
        // AI Orchestrator specific chips
        if (place.priority === 'anchor') {
            chips.push(this.createChip('anchor', 'Key destination'));
        } else if (place.priority === 'filler') {
            chips.push(this.createChip('filler', 'Supports itinerary'));
        }
        
        // Novelty/Discovery
        if (place.noveltyBonus && place.noveltyBonus > 0.8) {
            chips.push(this.createChip('novelty', 'New discovery'));
        }
        
        // Route optimization
        if (place.detourInfo && place.detourInfo.additionalMinutes <= 2) {
            chips.push(this.createChip('route_optimized', 'Zero detour'));
        }
        
        // Budget considerations
        if (place.price_level !== undefined) {
            if (place.price_level <= 2) {
                chips.push(this.createChip('budget_friendly', this.getPriceLabel(place.price_level)));
            } else if (place.price_level >= 4) {
                chips.push(this.createChip('premium', this.getPriceLabel(place.price_level)));
            }
        }
        
        return chips;
    }

    /**
     * Generate detailed scoring explanation
     */
    generateScoringExplanation(place, showBreakdown = false) {
        if (!place.aiScore && !place.corridorScore && !place.scoreBreakdown) {
            return null;
        }
        
        const score = place.aiScore || place.corridorScore || 0;
        const breakdown = place.scoreBreakdown || {};
        
        let explanation = `AI Score: ${score.toFixed(1)}/5.0`;
        
        if (showBreakdown && Object.keys(breakdown).length > 0) {
            const factors = [];
            
            if (breakdown.rating !== undefined) {
                factors.push(`Rating: ${breakdown.rating.toFixed(1)}`);
            }
            if (breakdown.popularity !== undefined) {
                factors.push(`Popularity: ${(breakdown.popularity * 100).toFixed(0)}%`);
            }
            if (breakdown.weatherFit !== undefined) {
                factors.push(`Weather fit: ${(breakdown.weatherFit * 100).toFixed(0)}%`);
            }
            if (breakdown.interestMatch !== undefined) {
                factors.push(`Interest match: ${(breakdown.interestMatch * 100).toFixed(0)}%`);
            }
            if (breakdown.efficiency !== undefined) {
                factors.push(`Route efficiency: ${(breakdown.efficiency * 100).toFixed(0)}%`);
            }
            
            if (factors.length > 0) {
                explanation += `\n\nBreakdown:\n${factors.join('\n')}`;
            }
        }
        
        return explanation;
    }

    /**
     * Create a single explainability chip
     */
    createChip(type, customText = null) {
        const config = this.chipTypes[type];
        if (!config) return null;
        
        return {
            type,
            icon: config.icon,
            label: customText || config.label,
            color: config.color,
            className: `explainability-chip chip-${type}`
        };
    }

    /**
     * Determine weather compatibility chip
     */
    getWeatherChip(place, weather) {
        if (!weather || !weather.precipitation_probability) return null;
        
        const isOutdoor = place.types?.some(type => 
            ['park', 'tourist_attraction', 'amusement_park', 'zoo', 'beach'].includes(type)
        );
        
        if (isOutdoor) {
            if (weather.precipitation_probability < 20) {
                return this.createChip('weather_perfect', 'Perfect weather');
            } else if (weather.precipitation_probability < 50) {
                return this.createChip('weather_good', 'Good weather');
            }
        } else {
            if (weather.precipitation_probability > 70) {
                return this.createChip('weather_indoor', 'Weather-proof');
            }
        }
        
        return null;
    }

    /**
     * Render chips as HTML
     */
    renderChips(chips, maxVisible = 4) {
        if (!chips || chips.length === 0) return '';
        
        const visibleChips = chips.slice(0, maxVisible);
        const hiddenCount = Math.max(0, chips.length - maxVisible);
        
        let html = '<div class="explainability-chips">';
        
        visibleChips.forEach(chip => {
            html += `
                <span class="explainability-chip ${chip.className}" 
                      style="background-color: ${chip.color}15; border-color: ${chip.color}40; color: ${chip.color};">
                    <span class="chip-icon">${chip.icon}</span>
                    <span class="chip-label">${chip.label}</span>
                </span>
            `;
        });
        
        if (hiddenCount > 0) {
            html += `
                <button class="show-more-chips" onclick="this.parentElement.classList.toggle('expanded')">
                    +${hiddenCount} more
                </button>
            `;
            
            // Add hidden chips
            const hiddenChips = chips.slice(maxVisible);
            html += '<div class="hidden-chips">';
            hiddenChips.forEach(chip => {
                html += `
                    <span class="explainability-chip ${chip.className}" 
                          style="background-color: ${chip.color}15; border-color: ${chip.color}40; color: ${chip.color};">
                        <span class="chip-icon">${chip.icon}</span>
                        <span class="chip-label">${chip.label}</span>
                    </span>
                `;
            });
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }

    /**
     * Render scoring explanation as HTML
     */
    renderScoringExplanation(place, showBreakdown = false) {
        const explanation = this.generateScoringExplanation(place, showBreakdown);
        if (!explanation) return '';
        
        return `
            <div class="scoring-explanation">
                <button class="score-toggle" onclick="this.parentElement.classList.toggle('expanded')">
                    <span class="score-value">${place.aiScore?.toFixed(1) || place.corridorScore?.toFixed(1) || '?'}</span>
                    <span class="score-label">AI Score</span>
                    <span class="expand-icon">ⓘ</span>
                </button>
                <div class="score-details">
                    <pre>${explanation}</pre>
                </div>
            </div>
        `;
    }

    /**
     * Utility methods
     */
    formatNumber(num) {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    }

    getPriceLabel(priceLevel) {
        const labels = {
            0: 'Free',
            1: '$',
            2: '$$', 
            3: '$$$',
            4: '$$$$'
        };
        return labels[priceLevel] || '$$';
    }

    /**
     * Add CSS styles for explainability chips
     */
    addStyles() {
        if (document.getElementById('explainability-chips-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'explainability-chips-styles';
        style.textContent = `
            .explainability-chips {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 8px;
                position: relative;
            }

            .explainability-chip {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border-radius: 12px;
                border: 1px solid;
                font-size: 11px;
                font-weight: 600;
                line-height: 1;
                white-space: nowrap;
                transition: all 0.2s ease;
            }

            .explainability-chip:hover {
                transform: scale(1.05);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .chip-icon {
                font-size: 12px;
                line-height: 1;
            }

            .chip-label {
                font-size: 10px;
                font-weight: 500;
            }

            .show-more-chips {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 4px 8px;
                font-size: 10px;
                font-weight: 500;
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .show-more-chips:hover {
                background: var(--surface-hover);
                color: var(--text-primary);
            }

            .hidden-chips {
                display: none;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 6px;
                width: 100%;
            }

            .explainability-chips.expanded .hidden-chips {
                display: flex;
            }

            .explainability-chips.expanded .show-more-chips {
                display: none;
            }

            .scoring-explanation {
                margin-top: 8px;
                position: relative;
            }

            .score-toggle {
                display: flex;
                align-items: center;
                gap: 6px;
                background: linear-gradient(135deg, var(--primary), var(--accent));
                color: white;
                border: none;
                border-radius: 8px;
                padding: 6px 10px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .score-toggle:hover {
                transform: scale(1.05);
                box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
            }

            .score-value {
                font-size: 13px;
                font-weight: 700;
            }

            .score-label {
                font-size: 9px;
                opacity: 0.9;
            }

            .expand-icon {
                font-size: 12px;
                opacity: 0.8;
            }

            .score-details {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 12px;
                box-shadow: var(--shadow-lg);
                z-index: 100;
                min-width: 200px;
                max-width: 300px;
            }

            .scoring-explanation.expanded .score-details {
                display: block;
            }

            .score-details pre {
                font-family: var(--font-mono), monospace;
                font-size: 11px;
                line-height: 1.4;
                margin: 0;
                white-space: pre-wrap;
                color: var(--text-primary);
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Initialize the explainability chips system
     */
    init() {
        this.addStyles();
        console.log('✅ Explainability Chips initialized');
    }
}

// Export for use in app
window.ExplainabilityChips = ExplainabilityChips;
export default ExplainabilityChips;