/**
 * Safety Score Module
 * Calculates A-F safety rating based on multiple factors
 */
class SafetyScoreCalculator {
    constructor() {
        this.temperatureThresholds = {
            hot: { min: 140, max: 165 },
            cold: { min: 32, max: 40 },
            frozen: { min: -10, max: 32 }
        };
        
        this.timeThresholds = {
            hot: 4,    // hours
            cold: 4,   // hours
            frozen: 24 // hours
        };
    }

    /**
     * Calculate safety score for a food item
     * @param {Object} foodItem - Food item with temperature, type, preparationTime
     * @param {Object} handling - Handling compliance data
     * @param {Object} storage - Storage conditions
     * @returns {Object} Safety score with letter grade and details
     */
    calculateSafetyScore(foodItem, handling = {}, storage = {}) {
        const factors = {
            temperature: this._calculateTemperatureScore(foodItem),
            time: this._calculateTimeScore(foodItem),
            handling: this._calculateHandlingScore(handling),
            storage: this._calculateStorageScore(storage)
        };

        const weights = {
            temperature: 0.4,
            time: 0.3,
            handling: 0.2,
            storage: 0.1
        };

        // Calculate weighted average
        const totalScore = Object.keys(factors).reduce((sum, key) => {
            return sum + (factors[key] * weights[key]);
        }, 0);

        const letterGrade = this._scoreToLetterGrade(totalScore);
        
        return {
            letterGrade,
            score: Math.round(totalScore * 100) / 100,
            factors,
            details: this._generateScoreDetails(foodItem, factors)
        };
    }

    /**
     * Calculate temperature-based score (0-100)
     */
    _calculateTemperatureScore(foodItem) {
        const { temperature, type } = foodItem;
        const thresholds = this.temperatureThresholds[type];
        
        if (!thresholds) return 50; // Default for unknown types

        if (temperature >= thresholds.min && temperature <= thresholds.max) {
            return 100; // Perfect temperature
        } else if (temperature < thresholds.min) {
            // Too cold - calculate penalty based on how far below
            const penalty = Math.min(50, (thresholds.min - temperature) * 2);
            return Math.max(0, 100 - penalty);
        } else {
            // Too hot - calculate penalty based on how far above
            const penalty = Math.min(50, (temperature - thresholds.max) * 2);
            return Math.max(0, 100 - penalty);
        }
    }

    /**
     * Calculate time-based score (0-100)
     */
    _calculateTimeScore(foodItem) {
        const { preparationTime, type } = foodItem;
        const maxHours = this.timeThresholds[type];
        
        if (preparationTime <= 0) return 100; // Fresh
        if (preparationTime >= maxHours) return 0; // Expired
        
        // Linear decrease from 100 to 0
        return Math.max(0, 100 - (preparationTime / maxHours) * 100);
    }

    /**
     * Calculate handling compliance score (0-100)
     */
    _calculateHandlingScore(handling) {
        const {
            staffTrained = true,
            protocolsFollowed = true,
            glovesUsed = true,
            cleanSurfaces = true
        } = handling;

        let score = 0;
        if (staffTrained) score += 25;
        if (protocolsFollowed) score += 25;
        if (glovesUsed) score += 25;
        if (cleanSurfaces) score += 25;

        return score;
    }

    /**
     * Calculate storage conditions score (0-100)
     */
    _calculateStorageScore(storage) {
        const {
            humidity = 50,
            contaminationRisk = 'low',
            properContainers = true,
            cleanEnvironment = true
        } = storage;

        let score = 0;
        
        // Humidity scoring (optimal range 40-60%)
        if (humidity >= 40 && humidity <= 60) {
            score += 30;
        } else if (humidity >= 30 && humidity <= 70) {
            score += 20;
        } else {
            score += 10;
        }

        // Contamination risk
        const contaminationScores = { low: 30, medium: 20, high: 0 };
        score += contaminationScores[contaminationRisk] || 0;

        // Container and environment
        if (properContainers) score += 20;
        if (cleanEnvironment) score += 20;

        return score;
    }

    /**
     * Convert numerical score to letter grade
     */
    _scoreToLetterGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    /**
     * Generate detailed score breakdown
     */
    _generateScoreDetails(foodItem, factors) {
        const details = [];
        
        if (factors.temperature < 70) {
            details.push(`Temperature concern: ${foodItem.temperature}°F`);
        }
        
        if (factors.time < 70) {
            details.push(`Time concern: ${foodItem.preparationTime} hours old`);
        }
        
        if (factors.handling < 70) {
            details.push('Handling compliance issues detected');
        }
        
        if (factors.storage < 70) {
            details.push('Storage conditions suboptimal');
        }

        return details.length > 0 ? details : ['All safety factors within acceptable ranges'];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SafetyScoreCalculator;
}
