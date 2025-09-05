/**
 * Person Module
 * Manages people looking for food
 */
class Person {
    constructor(data) {
        this.id = data.id || this._generateId();
        this.name = data.name;
        this.location = data.location;
        this.preferredFoodType = data.preferredFoodType || 'any'; // any, hot, cold, frozen
        this.maxDistance = data.maxDistance || 10; // miles
        this.dietaryRestrictions = data.dietaryRestrictions || [];
        this.createdAt = new Date();
        this.isActive = true;
        this.matchedFoodId = null;
    }

    /**
     * Generate unique ID for person
     */
    _generateId() {
        return 'person_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get formatted display data for UI
     */
    getDisplayData() {
        return {
            id: this.id,
            name: this.name,
            location: this.location,
            preferredFoodType: this.preferredFoodType,
            maxDistance: this.maxDistance,
            dietaryRestrictions: this.dietaryRestrictions,
            isActive: this.isActive,
            matchedFoodId: this.matchedFoodId,
            createdAt: this.createdAt
        };
    }

    /**
     * Check if person can accept a specific food type
     * @param {string} foodType - Type of food (hot, cold, frozen)
     * @returns {boolean} True if person can accept this food type
     */
    canAcceptFoodType(foodType) {
        return this.preferredFoodType === 'any' || this.preferredFoodType === foodType;
    }

    /**
     * Check if person has dietary restrictions that conflict with food
     * @param {Object} foodItem - Food item to check
     * @returns {boolean} True if there are conflicts
     */
    hasDietaryConflicts(foodItem) {
        // This is a simplified check - in a real app, you'd have more detailed
        // ingredient and allergen information
        if (this.dietaryRestrictions.length === 0) return false;
        
        // Basic checks for common restrictions
        const foodName = foodItem.name.toLowerCase();
        const conflicts = this.dietaryRestrictions.some(restriction => {
            const restrictionLower = restriction.toLowerCase();
            return foodName.includes(restrictionLower);
        });
        
        return conflicts;
    }

    /**
     * Match person with a food item
     * @param {string} foodId - ID of the food item
     */
    matchWithFood(foodId) {
        this.matchedFoodId = foodId;
    }

    /**
     * Clear food match
     */
    clearMatch() {
        this.matchedFoodId = null;
    }

    /**
     * Deactivate person (no longer looking for food)
     */
    deactivate() {
        this.isActive = false;
    }

    /**
     * Reactivate person (looking for food again)
     */
    reactivate() {
        this.isActive = true;
    }
}

/**
 * Person Manager - handles collection of people
 */
class PersonManager {
    constructor() {
        this.people = new Map();
    }

    /**
     * Add a new person
     * @param {Object} data - Person data
     * @returns {Person} Created person
     */
    addPerson(data) {
        const person = new Person(data);
        this.people.set(person.id, person);
        return person;
    }

    /**
     * Get person by ID
     * @param {string} id - Person ID
     * @returns {Person|null} Person or null if not found
     */
    getPerson(id) {
        return this.people.get(id) || null;
    }

    /**
     * Get all active people
     * @returns {Array<Person>} Active people
     */
    getActivePeople() {
        return Array.from(this.people.values())
            .filter(person => person.isActive);
    }

    /**
     * Get all people
     * @returns {Array<Person>} All people
     */
    getAllPeople() {
        return Array.from(this.people.values());
    }

    /**
     * Get people by preferred food type
     * @param {string} foodType - Food type (hot, cold, frozen, any)
     * @returns {Array<Person>} People who prefer this food type
     */
    getPeopleByFoodType(foodType) {
        return this.getActivePeople()
            .filter(person => person.canAcceptFoodType(foodType));
    }

    /**
     * Get people without matches
     * @returns {Array<Person>} People who haven't been matched
     */
    getUnmatchedPeople() {
        return this.getActivePeople()
            .filter(person => !person.matchedFoodId);
    }

    /**
     * Remove person
     * @param {string} id - Person ID
     * @returns {boolean} True if removed, false if not found
     */
    removePerson(id) {
        return this.people.delete(id);
    }

    /**
     * Clear all people
     */
    clear() {
        this.people.clear();
    }

    /**
     * Get statistics about people
     * @returns {Object} Statistics object
     */
    getStats() {
        const allPeople = this.getAllPeople();
        const activePeople = this.getActivePeople();
        const unmatchedPeople = this.getUnmatchedPeople();
        
        const foodTypeCounts = {};
        const dietaryRestrictionCounts = {};
        
        activePeople.forEach(person => {
            // Count by preferred food type
            const foodType = person.preferredFoodType;
            foodTypeCounts[foodType] = (foodTypeCounts[foodType] || 0) + 1;
            
            // Count dietary restrictions
            person.dietaryRestrictions.forEach(restriction => {
                dietaryRestrictionCounts[restriction] = (dietaryRestrictionCounts[restriction] || 0) + 1;
            });
        });

        return {
            total: allPeople.length,
            active: activePeople.length,
            inactive: allPeople.length - activePeople.length,
            unmatched: unmatchedPeople.length,
            matched: activePeople.length - unmatchedPeople.length,
            foodTypeCounts,
            dietaryRestrictionCounts
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Person, PersonManager };
}
