/**
 * Food Item Module
 * Manages food items and their properties
 */
class FoodItem {
    constructor(data) {
        this.id = data.id || this._generateId();
        this.name = data.name;
        this.restaurantName = data.restaurantName;
        this.type = data.type; // hot, cold, frozen
        this.preparationTime = data.preparationTime; // hours since preparation
        this.temperature = data.temperature; // current temperature in °F
        this.location = data.location || 'Unknown';
        this.createdAt = new Date();
        this.isAvailable = true;
        this.safetyScore = null;
    }

    /**
     * Generate unique ID for food item
     */
    _generateId() {
        return 'food_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Calculate and update safety score
     * @param {SafetyScoreCalculator} calculator - Safety score calculator instance
     * @param {Object} handling - Handling compliance data
     * @param {Object} storage - Storage conditions
     */
    updateSafetyScore(calculator, handling = {}, storage = {}) {
        this.safetyScore = calculator.calculateSafetyScore(this, handling, storage);
        return this.safetyScore;
    }

    /**
     * Get formatted display data for UI
     */
    getDisplayData() {
        return {
            id: this.id,
            name: this.name,
            restaurantName: this.restaurantName,
            type: this.type,
            preparationTime: this.preparationTime,
            temperature: this.temperature,
            location: this.location,
            safetyScore: this.safetyScore,
            isAvailable: this.isAvailable,
            createdAt: this.createdAt
        };
    }

    /**
     * Mark food as claimed/unavailable
     */
    claim() {
        this.isAvailable = false;
    }

    /**
     * Check if food is still safe to consume
     */
    isSafe() {
        if (!this.safetyScore) return false;
        return this.safetyScore.letterGrade !== 'F';
    }

    /**
     * Get time until expiration
     */
    getTimeUntilExpiration() {
        const maxHours = {
            hot: 4,
            cold: 4,
            frozen: 24
        }[this.type] || 4;

        const remainingHours = maxHours - this.preparationTime;
        return Math.max(0, remainingHours);
    }
}

/**
 * Food Manager - handles collection of food items
 */
class FoodManager {
    constructor() {
        this.foodItems = new Map();
    }

    /**
     * Add a new food item
     * @param {Object} data - Food item data
     * @returns {FoodItem} Created food item
     */
    addFoodItem(data) {
        const foodItem = new FoodItem(data);
        this.foodItems.set(foodItem.id, foodItem);
        return foodItem;
    }

    /**
     * Get food item by ID
     * @param {string} id - Food item ID
     * @returns {FoodItem|null} Food item or null if not found
     */
    getFoodItem(id) {
        return this.foodItems.get(id) || null;
    }

    /**
     * Get all available food items
     * @returns {Array<FoodItem>} Available food items
     */
    getAvailableFoodItems() {
        return Array.from(this.foodItems.values())
            .filter(item => item.isAvailable);
    }

    /**
     * Get all food items
     * @returns {Array<FoodItem>} All food items
     */
    getAllFoodItems() {
        return Array.from(this.foodItems.values());
    }

    /**
     * Remove food item
     * @param {string} id - Food item ID
     * @returns {boolean} True if removed, false if not found
     */
    removeFoodItem(id) {
        return this.foodItems.delete(id);
    }

    /**
     * Update food item safety scores for all items
     * @param {SafetyScoreCalculator} calculator - Safety score calculator
     */
    updateAllSafetyScores(calculator) {
        this.foodItems.forEach(item => {
            if (item.isAvailable) {
                item.updateSafetyScore(calculator);
            }
        });
    }

    /**
     * Get food items by type
     * @param {string} type - Food type (hot, cold, frozen)
     * @returns {Array<FoodItem>} Food items of specified type
     */
    getFoodItemsByType(type) {
        return this.getAvailableFoodItems()
            .filter(item => item.type === type);
    }

    /**
     * Get food items sorted by safety score
     * @returns {Array<FoodItem>} Food items sorted by safety score (highest first)
     */
    getFoodItemsBySafetyScore() {
        return this.getAvailableFoodItems()
            .filter(item => item.safetyScore)
            .sort((a, b) => b.safetyScore.score - a.safetyScore.score);
    }

    /**
     * Get food items that are expiring soon (within 1 hour)
     * @returns {Array<FoodItem>} Food items expiring soon
     */
    getExpiringSoon() {
        return this.getAvailableFoodItems()
            .filter(item => item.getTimeUntilExpiration() <= 1);
    }

    /**
     * Clear all food items
     */
    clear() {
        this.foodItems.clear();
    }

    /**
     * Get statistics about food items
     * @returns {Object} Statistics object
     */
    getStats() {
        const allItems = this.getAllFoodItems();
        const availableItems = this.getAvailableFoodItems();
        
        const typeCounts = {};
        const safetyGrades = {};
        
        availableItems.forEach(item => {
            // Count by type
            typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
            
            // Count by safety grade
            if (item.safetyScore) {
                const grade = item.safetyScore.letterGrade;
                safetyGrades[grade] = (safetyGrades[grade] || 0) + 1;
            }
        });

        return {
            total: allItems.length,
            available: availableItems.length,
            claimed: allItems.length - availableItems.length,
            typeCounts,
            safetyGrades,
            expiringSoon: this.getExpiringSoon().length
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FoodItem, FoodManager };
}
