/**
 * Compare Tray Component
 * Allows users to compare multiple travel options side-by-side
 * 
 * Features:
 * - Drag & drop to add items to comparison
 * - Side-by-side comparison view
 * - Smart comparison metrics
 * - Export comparison results
 */

class CompareTray {
    constructor() {
        this.compareItems = [];
        this.maxCompareItems = 4;
        this.isVisible = false;
        this.compareMetrics = [
            'rating',
            'price_level', 
            'distance',
            'duration',
            'weather_fit',
            'interest_match',
            'ai_score'
        ];
        
        this.init();
    }

    /**
     * Initialize the compare tray
     */
    init() {
        this.createCompareTrayHTML();
        this.setupEventListeners();
        this.addStyles();
        console.log('🔄 Compare Tray initialized');
    }

    /**
     * Create the compare tray HTML structure
     */
    createCompareTrayHTML() {
        const existingTray = document.getElementById('compare-tray');
        if (existingTray) {
            existingTray.remove();
        }

        const trayHTML = `
            <div id="compare-tray" class="compare-tray hidden">
                <div class="compare-tray-header">
                    <div class="compare-header-left">
                        <h3 class="compare-title">
                            <span class="compare-icon">⚖️</span>
                            Compare Options
                        </h3>
                        <span class="compare-count">${this.compareItems.length}/${this.maxCompareItems}</span>
                    </div>
                    <div class="compare-header-actions">
                        <button class="compare-action-btn" id="exportCompareBtn" title="Export Comparison">
                            <span>📤</span> Export
                        </button>
                        <button class="compare-action-btn" id="clearCompareBtn" title="Clear All">
                            <span>🗑️</span> Clear
                        </button>
                        <button class="compare-toggle-btn" id="toggleCompareBtn" title="Hide/Show">
                            <span class="toggle-icon">📐</span>
                        </button>
                    </div>
                </div>
                
                <div class="compare-tray-content">
                    <div class="compare-items-container" id="compareItemsContainer">
                        ${this.renderEmptyState()}
                    </div>
                </div>
                
                <div class="compare-tray-footer">
                    <div class="drop-zone" id="compareDropZone">
                        <div class="drop-zone-content">
                            <span class="drop-icon">⬇️</span>
                            <span class="drop-text">Drag items here to compare</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', trayHTML);
    }

    /**
     * Render empty state when no items are being compared
     */
    renderEmptyState() {
        return `
            <div class="compare-empty-state">
                <div class="empty-state-icon">⚖️</div>
                <div class="empty-state-title">Start Comparing</div>
                <div class="empty-state-text">
                    Drag and drop up to ${this.maxCompareItems} travel options here to compare them side-by-side
                </div>
                <div class="empty-state-features">
                    <div class="feature-item">
                        <span class="feature-icon">📊</span>
                        <span>Side-by-side metrics</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🎯</span>
                        <span>AI scoring breakdown</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📤</span>
                        <span>Export results</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Add an item to comparison tray
     */
    addToCompare(item) {
        if (this.compareItems.length >= this.maxCompareItems) {
            this.showNotification('Maximum comparison items reached', 'warning');
            return false;
        }

        // Check if item already exists
        const existingIndex = this.compareItems.findIndex(existing => 
            existing.place_id === item.place_id || existing.id === item.id
        );

        if (existingIndex !== -1) {
            this.showNotification('Item already in comparison', 'info');
            return false;
        }

        // Add enhanced data for comparison
        const enhancedItem = {
            ...item,
            addedAt: new Date().toISOString(),
            compareId: this.generateCompareId()
        };

        this.compareItems.push(enhancedItem);
        this.updateTrayDisplay();
        this.showTray();
        
        this.showNotification(`Added "${item.name}" to comparison`, 'success');
        return true;
    }

    /**
     * Remove an item from comparison
     */
    removeFromCompare(compareId) {
        const index = this.compareItems.findIndex(item => item.compareId === compareId);
        if (index !== -1) {
            const removedItem = this.compareItems.splice(index, 1)[0];
            this.updateTrayDisplay();
            
            if (this.compareItems.length === 0) {
                this.hideTray();
            }
            
            this.showNotification(`Removed "${removedItem.name}" from comparison`, 'info');
        }
    }

    /**
     * Clear all comparison items
     */
    clearCompare() {
        this.compareItems = [];
        this.updateTrayDisplay();
        this.hideTray();
        this.showNotification('Comparison cleared', 'info');
    }

    /**
     * Update the tray display with current items
     */
    updateTrayDisplay() {
        const container = document.getElementById('compareItemsContainer');
        const countDisplay = document.querySelector('.compare-count');
        
        if (!container) return;

        // Update count
        if (countDisplay) {
            countDisplay.textContent = `${this.compareItems.length}/${this.maxCompareItems}`;
        }

        // Render items or empty state
        if (this.compareItems.length === 0) {
            container.innerHTML = this.renderEmptyState();
        } else {
            container.innerHTML = this.renderComparisonView();
        }
    }

    /**
     * Render the comparison view with items
     */
    renderComparisonView() {
        if (this.compareItems.length === 0) return this.renderEmptyState();

        return `
            <div class="comparison-view">
                <div class="comparison-grid">
                    ${this.compareItems.map(item => this.renderCompareCard(item)).join('')}
                </div>
                
                <div class="comparison-metrics">
                    <h4 class="metrics-title">📊 Detailed Comparison</h4>
                    <div class="metrics-table">
                        ${this.renderMetricsTable()}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render a single compare card
     */
    renderCompareCard(item) {
        return `
            <div class="compare-card" data-compare-id="${item.compareId}">
                <div class="compare-card-header">
                    <div class="compare-card-title">
                        <h4 class="item-name">${item.name}</h4>
                        <button class="remove-compare-btn" onclick="window.compareTray?.removeFromCompare('${item.compareId}')">
                            <span>✕</span>
                        </button>
                    </div>
                    <div class="item-rating">
                        ⭐ ${item.rating ? item.rating.toFixed(1) : 'N/A'}
                    </div>
                </div>
                
                <div class="compare-card-content">
                    <div class="item-quick-stats">
                        <div class="stat-item">
                            <span class="stat-icon">💰</span>
                            <span class="stat-value">${this.formatPriceLevel(item.price_level)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">📏</span>
                            <span class="stat-value">${this.formatDistance(item.distance)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">🤖</span>
                            <span class="stat-value">${item.aiScore ? item.aiScore.toFixed(1) : 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div class="item-address">
                        📍 ${item.address || item.vicinity || 'Address not available'}
                    </div>
                    
                    ${item.opening_hours ? `
                        <div class="item-hours">
                            ${item.opening_hours.open_now ? '🟢 Open now' : '🔴 Closed'}
                        </div>
                    ` : ''}
                    
                    ${item.scoreBreakdown ? `
                        <div class="score-breakdown-mini">
                            <div class="breakdown-title">AI Score Breakdown:</div>
                            <div class="breakdown-bars">
                                ${Object.entries(item.scoreBreakdown).slice(0, 3).map(([key, value]) => `
                                    <div class="breakdown-bar">
                                        <span class="bar-label">${this.formatMetricName(key)}</span>
                                        <div class="bar-container">
                                            <div class="bar-fill" style="width: ${(value * 100).toFixed(0)}%"></div>
                                        </div>
                                        <span class="bar-value">${(value * 100).toFixed(0)}%</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Render metrics comparison table
     */
    renderMetricsTable() {
        if (this.compareItems.length === 0) return '';

        const metrics = [
            { key: 'rating', label: 'Rating', format: (val) => val ? `⭐ ${val.toFixed(1)}` : 'N/A' },
            { key: 'price_level', label: 'Price', format: (val) => this.formatPriceLevel(val) },
            { key: 'distance', label: 'Distance', format: (val) => this.formatDistance(val) },
            { key: 'aiScore', label: 'AI Score', format: (val) => val ? `🤖 ${val.toFixed(1)}` : 'N/A' },
            { key: 'user_ratings_total', label: 'Reviews', format: (val) => val ? `📝 ${this.formatNumber(val)}` : 'N/A' }
        ];

        return `
            <div class="metrics-table-container">
                <table class="metrics-table-element">
                    <thead>
                        <tr>
                            <th class="metric-header">Metric</th>
                            ${this.compareItems.map(item => `
                                <th class="item-header">
                                    <div class="item-header-content">
                                        <span class="item-header-name">${item.name}</span>
                                    </div>
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${metrics.map(metric => `
                            <tr class="metric-row">
                                <td class="metric-label">${metric.label}</td>
                                ${this.compareItems.map(item => {
                                    const value = item[metric.key];
                                    const formatted = metric.format(value);
                                    const isWinner = this.isMetricWinner(metric.key, value, this.compareItems);
                                    return `
                                        <td class="metric-value ${isWinner ? 'metric-winner' : ''}">
                                            ${formatted}
                                            ${isWinner ? '<span class="winner-badge">👑</span>' : ''}
                                        </td>
                                    `;
                                }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="comparison-summary">
                    <h5>💡 Quick Insights</h5>
                    <div class="insights-list">
                        ${this.generateComparisonInsights()}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate comparison insights
     */
    generateComparisonInsights() {
        if (this.compareItems.length < 2) return '<div class="insight-item">Add more items to see insights</div>';

        const insights = [];

        // Best rated
        const bestRated = this.compareItems.reduce((best, item) => 
            (item.rating || 0) > (best.rating || 0) ? item : best
        );
        insights.push(`<div class="insight-item">🏆 <strong>${bestRated.name}</strong> has the highest rating</div>`);

        // Most affordable
        const mostAffordable = this.compareItems.reduce((cheapest, item) => {
            const cheapestPrice = cheapest.price_level || 5;
            const itemPrice = item.price_level || 5;
            return itemPrice < cheapestPrice ? item : cheapest;
        });
        insights.push(`<div class="insight-item">💰 <strong>${mostAffordable.name}</strong> is the most budget-friendly</div>`);

        // Closest
        const closest = this.compareItems.reduce((near, item) => 
            (item.distance || Infinity) < (near.distance || Infinity) ? item : near
        );
        if (closest.distance) {
            insights.push(`<div class="insight-item">📍 <strong>${closest.name}</strong> is the closest option</div>`);
        }

        return insights.join('');
    }

    /**
     * Check if a metric value is the winner (best) among all items
     */
    isMetricWinner(metricKey, value, items) {
        if (value === undefined || value === null) return false;

        const metricValues = items.map(item => item[metricKey]).filter(val => val !== undefined && val !== null);
        if (metricValues.length === 0) return false;

        // For price_level, lower is better
        if (metricKey === 'price_level') {
            return value === Math.min(...metricValues);
        }

        // For distance, lower is better
        if (metricKey === 'distance') {
            return value === Math.min(...metricValues);
        }

        // For most metrics, higher is better
        return value === Math.max(...metricValues);
    }

    /**
     * Show the compare tray
     */
    showTray() {
        const tray = document.getElementById('compare-tray');
        if (tray) {
            tray.classList.remove('hidden');
            this.isVisible = true;
            
            // Animate in
            setTimeout(() => {
                tray.classList.add('visible');
            }, 50);
        }
    }

    /**
     * Hide the compare tray
     */
    hideTray() {
        const tray = document.getElementById('compare-tray');
        if (tray) {
            tray.classList.remove('visible');
            this.isVisible = false;
            
            setTimeout(() => {
                tray.classList.add('hidden');
            }, 300);
        }
    }

    /**
     * Toggle tray visibility
     */
    toggleTray() {
        if (this.isVisible) {
            this.hideTray();
        } else if (this.compareItems.length > 0) {
            this.showTray();
        }
    }

    /**
     * Export comparison data
     */
    exportComparison() {
        if (this.compareItems.length === 0) {
            this.showNotification('No items to export', 'warning');
            return;
        }

        const exportData = {
            exportDate: new Date().toISOString(),
            comparedItems: this.compareItems.length,
            items: this.compareItems.map(item => ({
                name: item.name,
                rating: item.rating,
                price_level: item.price_level,
                distance: item.distance,
                address: item.address || item.vicinity,
                aiScore: item.aiScore,
                place_id: item.place_id
            })),
            insights: this.generateComparisonInsights()
        };

        // Create downloadable file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `roamwise-comparison-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Comparison exported successfully', 'success');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Toggle tray visibility
        document.addEventListener('click', (e) => {
            if (e.target.closest('#toggleCompareBtn')) {
                this.toggleTray();
            }
        });

        // Clear comparison
        document.addEventListener('click', (e) => {
            if (e.target.closest('#clearCompareBtn')) {
                this.clearCompare();
            }
        });

        // Export comparison
        document.addEventListener('click', (e) => {
            if (e.target.closest('#exportCompareBtn')) {
                this.exportComparison();
            }
        });

        // Drag and drop functionality
        this.setupDragAndDrop();
    }

    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
        const dropZone = document.getElementById('compareDropZone');
        if (!dropZone) return;

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                this.addToCompare(data);
            } catch (error) {
                console.warn('Invalid drop data:', error);
            }
        });
    }

    /**
     * Utility methods
     */
    generateCompareId() {
        return `compare_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    formatPriceLevel(level) {
        if (level === undefined || level === null) return 'N/A';
        const levels = ['Free', '$', '$$', '$$$', '$$$$'];
        return levels[level] || 'N/A';
    }

    formatDistance(distance) {
        if (!distance) return 'N/A';
        if (distance < 1000) return `${Math.round(distance)}m`;
        return `${(distance / 1000).toFixed(1)}km`;
    }

    formatNumber(num) {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    }

    formatMetricName(key) {
        const names = {
            'rating': 'Rating',
            'popularity': 'Popularity',
            'weatherFit': 'Weather',
            'interestMatch': 'Interest',
            'travelTimePenalty': 'Distance',
            'noveltyBonus': 'Novelty'
        };
        return names[key] || key;
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `compare-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Add CSS styles for the compare tray
     */
    addStyles() {
        if (document.getElementById('compare-tray-styles')) return;

        const style = document.createElement('style');
        style.id = 'compare-tray-styles';
        style.textContent = `
            .compare-tray {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
                backdrop-filter: blur(20px);
                border-top: 1px solid rgba(0, 122, 255, 0.2);
                box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1);
                transform: translateY(100%);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1000;
                max-height: 70vh;
                overflow: hidden;
            }

            .compare-tray.visible {
                transform: translateY(0);
            }

            .compare-tray.hidden {
                display: none;
            }

            .compare-tray-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 24px;
                border-bottom: 1px solid rgba(0, 122, 255, 0.1);
                background: rgba(255, 255, 255, 0.8);
            }

            .compare-header-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .compare-title {
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 0;
                font-size: 18px;
                font-weight: 700;
                color: var(--text-primary);
            }

            .compare-icon {
                font-size: 20px;
            }

            .compare-count {
                padding: 4px 8px;
                background: linear-gradient(135deg, var(--primary), var(--accent));
                color: white;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }

            .compare-header-actions {
                display: flex;
                gap: 8px;
            }

            .compare-action-btn,
            .compare-toggle-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 12px;
                border: 1px solid rgba(0, 122, 255, 0.3);
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.9);
                color: var(--primary);
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .compare-action-btn:hover,
            .compare-toggle-btn:hover {
                background: var(--primary);
                color: white;
                transform: scale(1.05);
            }

            .compare-tray-content {
                padding: 20px 24px;
                overflow-y: auto;
                max-height: calc(70vh - 120px);
            }

            .compare-empty-state {
                text-align: center;
                padding: 40px 20px;
                color: var(--text-secondary);
            }

            .empty-state-icon {
                font-size: 48px;
                margin-bottom: 16px;
                opacity: 0.6;
            }

            .empty-state-title {
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 8px;
                color: var(--text-primary);
            }

            .empty-state-text {
                font-size: 14px;
                margin-bottom: 24px;
                line-height: 1.5;
            }

            .empty-state-features {
                display: flex;
                justify-content: center;
                gap: 24px;
                flex-wrap: wrap;
            }

            .feature-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                font-weight: 500;
            }

            .feature-icon {
                font-size: 16px;
            }

            .comparison-view {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }

            .comparison-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }

            .compare-card {
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid rgba(0, 122, 255, 0.2);
                border-radius: 12px;
                padding: 16px;
                transition: all 0.2s ease;
            }

            .compare-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }

            .compare-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12px;
            }

            .compare-card-title {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                width: 100%;
            }

            .item-name {
                font-size: 16px;
                font-weight: 700;
                margin: 0;
                color: var(--text-primary);
                flex: 1;
                line-height: 1.3;
            }

            .remove-compare-btn {
                background: rgba(220, 53, 69, 0.1);
                color: #dc3545;
                border: 1px solid rgba(220, 53, 69, 0.3);
                border-radius: 6px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 12px;
                margin-left: 8px;
                flex-shrink: 0;
            }

            .remove-compare-btn:hover {
                background: #dc3545;
                color: white;
            }

            .item-rating {
                font-size: 14px;
                font-weight: 600;
                color: var(--primary);
                margin-top: 4px;
            }

            .item-quick-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                margin-bottom: 12px;
            }

            .stat-item {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                font-weight: 500;
                padding: 4px 6px;
                background: rgba(0, 122, 255, 0.05);
                border-radius: 6px;
            }

            .stat-icon {
                font-size: 12px;
            }

            .item-address,
            .item-hours {
                font-size: 12px;
                color: var(--text-secondary);
                margin-bottom: 8px;
                line-height: 1.4;
            }

            .score-breakdown-mini {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid rgba(0, 122, 255, 0.1);
            }

            .breakdown-title {
                font-size: 11px;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 8px;
            }

            .breakdown-bars {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .breakdown-bar {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 10px;
            }

            .bar-label {
                min-width: 45px;
                font-weight: 500;
                color: var(--text-secondary);
            }

            .bar-container {
                flex: 1;
                height: 4px;
                background: rgba(0, 122, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
            }

            .bar-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary), var(--accent));
                border-radius: 2px;
                transition: width 0.3s ease;
            }

            .bar-value {
                min-width: 25px;
                text-align: right;
                font-weight: 600;
                color: var(--primary);
            }

            .comparison-metrics {
                background: rgba(255, 255, 255, 0.7);
                border-radius: 12px;
                padding: 20px;
                border: 1px solid rgba(0, 122, 255, 0.1);
            }

            .metrics-title {
                margin: 0 0 16px 0;
                font-size: 16px;
                font-weight: 700;
                color: var(--text-primary);
            }

            .metrics-table-container {
                overflow-x: auto;
            }

            .metrics-table-element {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
            }

            .metrics-table-element th,
            .metrics-table-element td {
                padding: 8px 12px;
                text-align: left;
                border-bottom: 1px solid rgba(0, 122, 255, 0.1);
            }

            .metric-header {
                background: rgba(0, 122, 255, 0.05);
                font-weight: 700;
                color: var(--text-primary);
                min-width: 80px;
            }

            .item-header {
                background: rgba(0, 122, 255, 0.05);
                font-weight: 600;
                color: var(--primary);
                min-width: 150px;
            }

            .item-header-content {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .item-header-name {
                font-weight: 700;
            }

            .metric-label {
                font-weight: 600;
                color: var(--text-primary);
            }

            .metric-value {
                font-weight: 500;
                color: var(--text-secondary);
                position: relative;
            }

            .metric-winner {
                background: linear-gradient(135deg, rgba(34, 170, 68, 0.1), rgba(40, 167, 69, 0.05));
                color: #22aa44;
                font-weight: 700;
            }

            .winner-badge {
                margin-left: 4px;
                font-size: 10px;
            }

            .comparison-summary {
                margin-top: 20px;
                padding-top: 16px;
                border-top: 1px solid rgba(0, 122, 255, 0.1);
            }

            .comparison-summary h5 {
                margin: 0 0 12px 0;
                font-size: 14px;
                font-weight: 700;
                color: var(--text-primary);
            }

            .insights-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .insight-item {
                font-size: 12px;
                line-height: 1.4;
                color: var(--text-secondary);
            }

            .compare-tray-footer {
                border-top: 1px solid rgba(0, 122, 255, 0.1);
                padding: 16px 24px;
                background: rgba(255, 255, 255, 0.8);
            }

            .drop-zone {
                border: 2px dashed rgba(0, 122, 255, 0.3);
                border-radius: 8px;
                padding: 16px;
                text-align: center;
                transition: all 0.2s ease;
                background: rgba(0, 122, 255, 0.02);
            }

            .drop-zone.drag-over {
                border-color: var(--primary);
                background: rgba(0, 122, 255, 0.1);
                transform: scale(1.02);
            }

            .drop-zone-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                color: var(--text-secondary);
                font-size: 14px;
                font-weight: 500;
            }

            .drop-icon {
                font-size: 18px;
            }

            .compare-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 8px;
                color: white;
                font-size: 14px;
                font-weight: 600;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .compare-notification.show {
                transform: translateX(0);
            }

            .compare-notification.success {
                background: linear-gradient(135deg, #22aa44, #28a745);
            }

            .compare-notification.warning {
                background: linear-gradient(135deg, #ff8800, #fd7e14);
            }

            .compare-notification.info {
                background: linear-gradient(135deg, var(--primary), var(--accent));
            }

            @media (max-width: 768px) {
                .comparison-grid {
                    grid-template-columns: 1fr;
                }
                
                .item-quick-stats {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .empty-state-features {
                    flex-direction: column;
                    gap: 12px;
                }
                
                .compare-header-actions {
                    flex-direction: column;
                    gap: 4px;
                }
                
                .compare-action-btn,
                .compare-toggle-btn {
                    font-size: 11px;
                    padding: 6px 10px;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Export for use in app
window.CompareTray = CompareTray;
export default CompareTray;