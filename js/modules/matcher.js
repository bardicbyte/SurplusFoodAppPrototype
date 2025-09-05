/**
 * Matcher Module
 * Handles matching surplus food with people
 */
class FoodMatcher {
    constructor() {
        this.matches = new Map(); // foodId -> personId
        this.reverseMatches = new Map(); // personId -> foodId
    }

    /**
     * Find matches between available food and people
     * @param {FoodManager} foodManager - Food manager instance
     * @param {PersonManager} personManager - Person manager instance
     * @returns {Array<Object>} Array of match objects
     */
    findMatches(foodManager, personManager) {
        const availableFood = foodManager.getAvailableFoodItems();
        const activePeople = personManager.getActivePeople();
        
        const matches = [];
        
        // Clear existing matches
        this.clearMatches();
        
        // Create a copy of people for matching
        const unmatchedPeople = [...activePeople];
        
        // Sort food by safety score (highest first) and time urgency
        const sortedFood = availableFood
            .filter(food => food.safetyScore && food.safetyScore.letterGrade !== 'F')
            .sort((a, b) => {
                // First sort by safety score
                const safetyDiff = b.safetyScore.score - a.safetyScore.score;
                if (Math.abs(safetyDiff) > 10) return safetyDiff;
                
                // Then by time urgency (less time remaining = higher priority)
                const timeA = a.getTimeUntilExpiration();
                const timeB = b.getTimeUntilExpiration();
                return timeA - timeB;
            });

        // Match each food item with the best available person
        for (const food of sortedFood) {
            const bestMatch = this._findBestPersonForFood(food, unmatchedPeople);
            
            if (bestMatch) {
                const match = this._createMatch(food, bestMatch);
                matches.push(match);
                
                // Record the match
                this.matches.set(food.id, bestMatch.id);
                this.reverseMatches.set(bestMatch.id, food.id);
                
                // Remove person from unmatched list
                const personIndex = unmatchedPeople.findIndex(p => p.id === bestMatch.id);
                if (personIndex !== -1) {
                    unmatchedPeople.splice(personIndex, 1);
                }
                
                // Update person's match status
                bestMatch.matchWithFood(food.id);
            }
        }

        return matches;
    }

    /**
     * Find the best person for a specific food item
     * @param {FoodItem} food - Food item to match
     * @param {Array<Person>} availablePeople - Available people
     * @returns {Person|null} Best matching person or null
     */
    _findBestPersonForFood(food, availablePeople) {
        let bestMatch = null;
        let bestScore = -1;

        for (const person of availablePeople) {
            const score = this._calculateMatchScore(food, person);
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = person;
            }
        }

        // Only return match if score is above threshold
        return bestScore > 0.3 ? bestMatch : null;
    }

    /**
     * Calculate match score between food and person (0-1)
     * @param {FoodItem} food - Food item
     * @param {Person} person - Person
     * @returns {number} Match score between 0 and 1
     */
    _calculateMatchScore(food, person) {
        let score = 0;
        let factors = 0;

        // Food type preference (40% weight)
        if (person.canAcceptFoodType(food.type)) {
            score += 0.4;
        } else {
            return 0; // No match if food type doesn't match preference
        }
        factors++;

        // Safety score (30% weight)
        if (food.safetyScore) {
            const safetyWeight = food.safetyScore.score / 100;
            score += safetyWeight * 0.3;
        }
        factors++;

        // Dietary restrictions (20% weight)
        if (!person.hasDietaryConflicts(food)) {
            score += 0.2;
        } else {
            return 0; // No match if dietary conflicts
        }
        factors++;

        // Time urgency (10% weight)
        const timeRemaining = food.getTimeUntilExpiration();
        const urgencyScore = Math.max(0, 1 - (timeRemaining / 4)); // More urgent = higher score
        score += urgencyScore * 0.1;
        factors++;

        return score / factors;
    }

    /**
     * Create a match object
     * @param {FoodItem} food - Food item
     * @param {Person} person - Person
     * @returns {Object} Match object
     */
    _createMatch(food, person) {
        return {
            id: `match_${food.id}_${person.id}`,
            foodId: food.id,
            personId: person.id,
            food: food.getDisplayData(),
            person: person.getDisplayData(),
            matchScore: this._calculateMatchScore(food, person),
            createdAt: new Date(),
            status: 'active'
        };
    }

    /**
     * Get all current matches
     * @returns {Array<Object>} Array of match objects
     */
    getMatches() {
        return Array.from(this.matches.entries()).map(([foodId, personId]) => {
            return {
                foodId,
                personId,
                matchId: `match_${foodId}_${personId}`
            };
        });
    }

    /**
     * Get match for a specific food item
     * @param {string} foodId - Food item ID
     * @returns {string|null} Person ID or null if no match
     */
    getMatchForFood(foodId) {
        return this.matches.get(foodId) || null;
    }

    /**
     * Get match for a specific person
     * @param {string} personId - Person ID
     * @returns {string|null} Food ID or null if no match
     */
    getMatchForPerson(personId) {
        return this.reverseMatches.get(personId) || null;
    }

    /**
     * Remove a specific match
     * @param {string} foodId - Food item ID
     * @param {string} personId - Person ID
     * @returns {boolean} True if match was removed
     */
    removeMatch(foodId, personId) {
        const foodMatch = this.matches.get(foodId);
        const personMatch = this.reverseMatches.get(personId);
        
        if (foodMatch === personId && personMatch === foodId) {
            this.matches.delete(foodId);
            this.reverseMatches.delete(personId);
            return true;
        }
        
        return false;
    }

    /**
     * Clear all matches
     */
    clearMatches() {
        this.matches.clear();
        this.reverseMatches.clear();
    }

    /**
     * Get matching statistics
     * @param {FoodManager} foodManager - Food manager instance
     * @param {PersonManager} personManager - Person manager instance
     * @returns {Object} Matching statistics
     */
    getStats(foodManager, personManager) {
        const totalFood = foodManager.getAvailableFoodItems().length;
        const totalPeople = personManager.getActivePeople().length;
        const matchedFood = this.matches.size;
        const matchedPeople = this.reverseMatches.size;
        
        return {
            totalFood,
            totalPeople,
            matchedFood,
            matchedPeople,
            unmatchedFood: totalFood - matchedFood,
            unmatchedPeople: totalPeople - matchedPeople,
            matchRate: totalFood > 0 ? (matchedFood / totalFood) * 100 : 0
        };
    }

    /**
     * Suggest improvements for better matching
     * @param {FoodManager} foodManager - Food manager instance
     * @param {PersonManager} personManager - Person manager instance
     * @returns {Array<string>} Array of improvement suggestions
     */
    getImprovementSuggestions(foodManager, personManager) {
        const suggestions = [];
        const stats = this.getStats(foodManager, personManager);
        
        if (stats.matchRate < 50) {
            suggestions.push('Consider adding more people or food items to improve match rate');
        }
        
        if (stats.unmatchedFood > stats.unmatchedPeople) {
            suggestions.push('More people needed - consider promoting the app');
        }
        
        if (stats.unmatchedPeople > stats.unmatchedFood) {
            suggestions.push('More food donations needed - reach out to restaurants');
        }
        
        const expiringFood = foodManager.getExpiringSoon();
        if (expiringFood.length > 0) {
            suggestions.push(`${expiringFood.length} food items expiring soon - prioritize these matches`);
        }
        
        return suggestions;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FoodMatcher;
}
