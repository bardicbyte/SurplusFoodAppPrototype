/**
 * Mobile Surplus Food App Controller
 * Optimized for mobile phones with sidebar navigation
 */
class SurplusFoodApp {
    constructor() {
        this.safetyCalculator = new SafetyScoreCalculator();
        this.foodManager = new FoodManager();
        this.personManager = new PersonManager();
        this.matcher = new FoodMatcher();
        
        this.currentPage = 'home';
        this.currentFilter = 'all';
        this.searchQuery = '';
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.updateDisplay();
        this.showPage('home');
    }

    /**
     * Set up event listeners for mobile interface
     */
    setupEventListeners() {
        // Sidebar controls
        const menuToggle = document.getElementById('menuToggle');
        const closeSidebar = document.getElementById('closeSidebar');
        const overlay = document.getElementById('overlay');
        const sidebar = document.getElementById('sidebar');

        menuToggle.addEventListener('click', () => this.toggleSidebar());
        closeSidebar.addEventListener('click', () => this.closeSidebar());
        overlay.addEventListener('click', () => this.closeSidebar());

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
                this.closeSidebar();
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.updateDisplay();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.getAttribute('data-filter');
                this.updateDisplay();
            });
        });

        // Form submissions
        document.getElementById('foodForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFoodFormSubmit();
        });

        // Profile button
        document.getElementById('profileBtn').addEventListener('click', () => {
            this.showPage('profile');
        });

        // Floating action button
        document.getElementById('floatingAddBtn').addEventListener('click', () => {
            this.showPage('add-food');
        });
    }

    /**
     * Toggle sidebar visibility
     */
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }

    /**
     * Close sidebar
     */
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    }

    /**
     * Show specific page
     * @param {string} pageName - Name of the page to show
     */
    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const pageElement = document.getElementById(pageName + 'Page');
        if (pageElement) {
            pageElement.classList.add('active');
            this.currentPage = pageName;
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // Update page content
        this.updatePageContent(pageName);
    }

    /**
     * Update content for specific page
     * @param {string} pageName - Name of the page
     */
    updatePageContent(pageName) {
        switch (pageName) {
            case 'home':
                this.updateRestaurantDisplay();
                break;
            case 'restaurants':
                this.updateRestaurantDetails();
                break;
            case 'orders':
                this.updateOrdersDisplay();
                break;
            case 'matches':
                this.updateMatchesDisplay();
                break;
            case 'add-food':
                // Form is already in HTML
                break;
            case 'profile':
                // Profile content is already in HTML
                break;
        }
    }

    /**
     * Load sample data for demonstration
     */
    loadSampleData() {
        // Sample food items with more restaurant variety and beautiful images
        const sampleFood = [
            {
                name: 'Chicken Alfredo Pasta',
                restaurantName: 'Mama Mia Restaurant',
                type: 'hot',
                preparationTime: 1.5,
                temperature: 145,
                location: 'Downtown',
                image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center',
                description: 'Creamy alfredo sauce with tender chicken over perfectly cooked pasta'
            },
            {
                name: 'Caesar Salad',
                restaurantName: 'Green Garden Cafe',
                type: 'cold',
                preparationTime: 0.5,
                temperature: 38,
                location: 'Midtown',
                image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center',
                description: 'Fresh romaine lettuce with parmesan cheese and croutons'
            },
            {
                name: 'Chocolate Ice Cream',
                restaurantName: 'Sweet Treats',
                type: 'frozen',
                preparationTime: 2,
                temperature: 15,
                location: 'Uptown',
                image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&crop=center',
                description: 'Rich and creamy chocolate ice cream with chocolate chips'
            },
            {
                name: 'Beef Stir Fry',
                restaurantName: 'Dragon Palace',
                type: 'hot',
                preparationTime: 3.5,
                temperature: 120,
                location: 'Eastside',
                image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center',
                description: 'Tender beef strips with fresh vegetables in savory sauce'
            },
            {
                name: 'Margherita Pizza',
                restaurantName: 'Pizza Corner',
                type: 'hot',
                preparationTime: 2.5,
                temperature: 135,
                location: 'Westside',
                image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center',
                description: 'Classic pizza with fresh mozzarella, tomatoes, and basil'
            },
            {
                name: 'Fresh Fruit Bowl',
                restaurantName: 'Healthy Bites',
                type: 'cold',
                preparationTime: 1,
                temperature: 40,
                location: 'Downtown',
                image: 'https://images.unsplash.com/photo-1553530979-4c4b2a0a0a0a?w=400&h=300&fit=crop&crop=center',
                description: 'Seasonal fresh fruits including berries, melon, and citrus'
            },
            {
                name: 'Fish & Chips',
                restaurantName: 'The British Pub',
                type: 'hot',
                preparationTime: 4,
                temperature: 110,
                location: 'Old Town',
                image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&h=300&fit=crop&crop=center',
                description: 'Crispy battered fish with golden chips and mushy peas'
            },
            {
                name: 'Vanilla Ice Cream',
                restaurantName: 'Sweet Treats',
                type: 'frozen',
                preparationTime: 1.5,
                temperature: 20,
                location: 'Uptown',
                image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&crop=center',
                description: 'Smooth vanilla ice cream with real vanilla bean specks'
            },
            {
                name: 'Chicken Teriyaki Bowl',
                restaurantName: 'Tokyo Express',
                type: 'hot',
                preparationTime: 2,
                temperature: 140,
                location: 'Chinatown',
                image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center',
                description: 'Grilled chicken with teriyaki sauce over steamed rice'
            },
            {
                name: 'Mediterranean Wrap',
                restaurantName: 'Sunshine Cafe',
                type: 'cold',
                preparationTime: 0.8,
                temperature: 42,
                location: 'Riverside',
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
                description: 'Fresh vegetables, hummus, and feta in a soft tortilla wrap'
            }
        ];

        // Sample people
        const samplePeople = [
            {
                name: 'John Smith',
                location: 'Downtown',
                preferredFoodType: 'hot'
            },
            {
                name: 'Sarah Johnson',
                location: 'Midtown',
                preferredFoodType: 'any'
            },
            {
                name: 'Mike Chen',
                location: 'Uptown',
                preferredFoodType: 'cold'
            },
            {
                name: 'Lisa Davis',
                location: 'Eastside',
                preferredFoodType: 'frozen'
            }
        ];

        // Add sample data
        sampleFood.forEach(foodData => {
            const foodItem = this.foodManager.addFoodItem(foodData);
            foodItem.updateSafetyScore(this.safetyCalculator);
        });

        samplePeople.forEach(personData => {
            this.personManager.addPerson(personData);
        });
    }

    /**
     * Handle food form submission
     */
    handleFoodFormSubmit() {
        const formData = {
            name: document.getElementById('foodName').value,
            restaurantName: document.getElementById('restaurantName').value,
            type: document.getElementById('foodType').value,
            preparationTime: parseFloat(document.getElementById('preparationTime').value),
            temperature: parseFloat(document.getElementById('temperature').value),
            location: 'Current Location'
        };

        const foodItem = this.foodManager.addFoodItem(formData);
        foodItem.updateSafetyScore(this.safetyCalculator);
        
        // Clear form
        document.getElementById('foodForm').reset();
        
        // Show success message
        this.showNotification('Food added successfully!', 'success');
        
        // Update display
        this.updateDisplay();
        
        // Go back to home page
        this.showPage('home');
    }

    /**
     * Update restaurant display (main page)
     */
    updateRestaurantDisplay() {
        const container = document.getElementById('restaurantList');
        let foodItems = this.foodManager.getAvailableFoodItems();

        // Apply search filter
        if (this.searchQuery) {
            foodItems = foodItems.filter(food => 
                food.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                food.restaurantName.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        // Apply type filter
        if (this.currentFilter !== 'all') {
            foodItems = foodItems.filter(food => food.type === this.currentFilter);
        }

        // Sort by safety score and time urgency
        foodItems = foodItems
            .filter(food => food.safetyScore && food.safetyScore.letterGrade !== 'F')
            .sort((a, b) => {
                const safetyDiff = b.safetyScore.score - a.safetyScore.score;
                if (Math.abs(safetyDiff) > 10) return safetyDiff;
                return a.getTimeUntilExpiration() - b.getTimeUntilExpiration();
            });

        container.innerHTML = '';

        if (foodItems.length === 0) {
            container.innerHTML = '<div class="no-items">No food items available</div>';
            return;
        }

        foodItems.forEach(food => {
            const restaurantCard = this.createRestaurantCard(food);
            container.appendChild(restaurantCard);
        });
    }

    /**
     * Create restaurant card for main page
     * @param {FoodItem} food - Food item
     * @returns {HTMLElement} Restaurant card element
     */
    createRestaurantCard(food) {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        
        const safetyScore = food.safetyScore;
        const safetyClass = safetyScore ? safetyScore.letterGrade : 'unknown';
        const safetyText = safetyScore ? safetyScore.letterGrade : '?';
        const timeLeft = food.getTimeUntilExpiration();
        
        // Get food type icon
        const getFoodTypeIcon = (type) => {
            switch(type) {
                case 'hot': return 'fas fa-fire';
                case 'cold': return 'fas fa-snowflake';
                case 'frozen': return 'fas fa-icicles';
                default: return 'fas fa-utensils';
            }
        };
        
        // Get food type emoji
        const getFoodTypeEmoji = (type) => {
            switch(type) {
                case 'hot': return '🔥';
                case 'cold': return '❄️';
                case 'frozen': return '🧊';
                default: return '🍽️';
            }
        };
        
        // Check if food is urgent (less than 1 hour left)
        const isUrgent = timeLeft <= 1;
        const urgentClass = isUrgent ? 'urgent' : '';
        
        card.innerHTML = `
            <div class="food-image ${urgentClass}" style="background-image: url('${food.image || this.getDefaultFoodImage(food.type)}')">
                <div class="food-type-badge ${food.type}">
                    <i class="${getFoodTypeIcon(food.type)}"></i>
                    ${food.type.toUpperCase()}
                </div>
                <div class="safety-score-badge ${safetyClass}">${safetyText}</div>
                ${isUrgent ? '<div class="urgent-badge">URGENT</div>' : ''}
            </div>
            
            <div class="restaurant-content">
                <div class="restaurant-header">
                    <div class="restaurant-name">${food.restaurantName}</div>
                    <div class="food-name">${food.name}</div>
                </div>
                
                <div class="restaurant-info">
                    <div class="food-type">
                        <i class="${getFoodTypeIcon(food.type)}"></i>
                        ${food.type.toUpperCase()}
                    </div>
                    <div class="time-left">
                        <i class="fas fa-clock"></i>
                        ${timeLeft.toFixed(1)}h left
                    </div>
                </div>
                
                <div class="food-details">
                    <div class="temperature">
                        <i class="fas fa-thermometer-half"></i>
                        ${food.temperature}°F
                    </div>
                    <div class="age">
                        <i class="fas fa-clock"></i>
                        ${food.preparationTime}h old
                    </div>
                </div>
            </div>
        `;
        
        // Add click handler for food details
        card.addEventListener('click', () => {
            this.showFoodDetails(food);
        });
        
        return card;
    }
    
    /**
     * Get default food image based on type
     * @param {string} type - Food type
     * @returns {string} Default image URL
     */
    getDefaultFoodImage(type) {
        const defaultImages = {
            hot: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
            cold: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center',
            frozen: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&crop=center'
        };
        return defaultImages[type] || defaultImages.hot;
    }

    /**
     * Show food details in a beautiful modal
     * @param {FoodItem} food - Food item
     */
    showFoodDetails(food) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('foodDetailModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'foodDetailModal';
            modal.className = 'food-detail-modal';
            modal.innerHTML = `
                <div class="modal-overlay" id="modalOverlay"></div>
                <div class="modal-content">
                    <button class="close-modal" id="closeModal">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-body">
                        <div class="food-detail-image"></div>
                        <div class="food-detail-content">
                            <h2 class="food-detail-title"></h2>
                            <p class="food-detail-restaurant"></p>
                            <p class="food-detail-description"></p>
                            <div class="food-detail-stats"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add event listeners
            document.getElementById('closeModal').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            document.getElementById('modalOverlay').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Populate modal with food data
        const safetyScore = food.safetyScore;
        const safetyClass = safetyScore ? safetyScore.letterGrade : 'unknown';
        const timeLeft = food.getTimeUntilExpiration();
        
        modal.querySelector('.food-detail-image').style.backgroundImage = 
            `url('${food.image || this.getDefaultFoodImage(food.type)}')`;
        modal.querySelector('.food-detail-title').textContent = food.name;
        modal.querySelector('.food-detail-restaurant').textContent = food.restaurantName;
        modal.querySelector('.food-detail-description').textContent = 
            food.description || `Delicious ${food.type} food from ${food.restaurantName}`;
        
        modal.querySelector('.food-detail-stats').innerHTML = `
            <div class="stat-item">
                <i class="fas fa-thermometer-half"></i>
                <span>${food.temperature}°F</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-clock"></i>
                <span>${food.preparationTime}h old</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-shield-alt"></i>
                <span class="safety-score ${safetyClass}">${safetyClass}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-hourglass-half"></i>
                <span>${timeLeft.toFixed(1)}h left</span>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'flex';
    }

    /**
     * Update restaurant details page
     */
    updateRestaurantDetails() {
        const container = document.getElementById('restaurantDetails');
        const restaurants = this.getRestaurantsFromFood();
        
        container.innerHTML = '';
        
        if (restaurants.length === 0) {
            container.innerHTML = '<div class="no-items">No restaurants available</div>';
            return;
        }

        restaurants.forEach(restaurant => {
            const restaurantCard = this.createRestaurantDetailCard(restaurant);
            container.appendChild(restaurantCard);
        });
    }

    /**
     * Get unique restaurants from food items
     * @returns {Array} Array of restaurant objects
     */
    getRestaurantsFromFood() {
        const restaurants = new Map();
        
        this.foodManager.getAvailableFoodItems().forEach(food => {
            if (!restaurants.has(food.restaurantName)) {
                restaurants.set(food.restaurantName, {
                    name: food.restaurantName,
                    location: food.location,
                    foodItems: []
                });
            }
            restaurants.get(food.restaurantName).foodItems.push(food);
        });

        return Array.from(restaurants.values());
    }

    /**
     * Create restaurant detail card
     * @param {Object} restaurant - Restaurant object
     * @returns {HTMLElement} Restaurant detail card
     */
    createRestaurantDetailCard(restaurant) {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        
        const avgSafetyScore = this.calculateAverageSafetyScore(restaurant.foodItems);
        const safetyClass = avgSafetyScore.letterGrade;
        
        card.innerHTML = `
            <div class="restaurant-header">
                <div>
                    <div class="restaurant-name">${restaurant.name}</div>
                    <div class="food-name">${restaurant.location}</div>
                </div>
                <div class="safety-score ${safetyClass}">${safetyClass}</div>
            </div>
            
            <div class="restaurant-info">
                <div class="food-type">${restaurant.foodItems.length} items available</div>
                <div class="time-left">Avg Score: ${avgSafetyScore.score.toFixed(1)}</div>
            </div>
            
            <div class="food-details">
                <div>Available: ${restaurant.foodItems.map(f => f.name).join(', ')}</div>
            </div>
        `;
        
        return card;
    }

    /**
     * Calculate average safety score for restaurant
     * @param {Array} foodItems - Array of food items
     * @returns {Object} Average safety score
     */
    calculateAverageSafetyScore(foodItems) {
        const validScores = foodItems.filter(f => f.safetyScore).map(f => f.safetyScore.score);
        if (validScores.length === 0) return { letterGrade: '?', score: 0 };
        
        const avgScore = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
        
        let letterGrade = 'F';
        if (avgScore >= 90) letterGrade = 'A';
        else if (avgScore >= 80) letterGrade = 'B';
        else if (avgScore >= 70) letterGrade = 'C';
        else if (avgScore >= 60) letterGrade = 'D';
        
        return { letterGrade, score: avgScore };
    }

    /**
     * Update orders display
     */
    updateOrdersDisplay() {
        const container = document.getElementById('ordersList');
        const matches = this.matcher.getMatches();
        
        container.innerHTML = '';
        
        if (matches.length === 0) {
            container.innerHTML = '<div class="no-items">No orders yet</div>';
            return;
        }

        matches.forEach(match => {
            const food = this.foodManager.getFoodItem(match.foodId);
            const person = this.personManager.getPerson(match.personId);
            
            if (food && person) {
                const orderCard = this.createOrderCard(food, person);
                container.appendChild(orderCard);
            }
        });
    }

    /**
     * Create order card
     * @param {FoodItem} food - Food item
     * @param {Person} person - Person
     * @returns {HTMLElement} Order card
     */
    createOrderCard(food, person) {
        const card = document.createElement('div');
        card.className = 'order-card';
        
        const safetyScore = food.safetyScore;
        const safetyClass = safetyScore ? safetyScore.letterGrade : 'unknown';
        
        card.innerHTML = `
            <h3>${food.name}</h3>
            <p><strong>Restaurant:</strong> ${food.restaurantName}</p>
            <p><strong>Safety Score:</strong> <span class="safety-score ${safetyClass}">${safetyClass}</span></p>
            <p><strong>Status:</strong> Matched with ${person.name}</p>
            <p><strong>Time Left:</strong> ${food.getTimeUntilExpiration().toFixed(1)} hours</p>
        `;
        
        return card;
    }

    /**
     * Update matches display
     */
    updateMatchesDisplay() {
        const container = document.getElementById('matchesList');
        const matches = this.matcher.getMatches();
        
        container.innerHTML = '';
        
        if (matches.length === 0) {
            container.innerHTML = '<div class="no-items">No matches found</div>';
            return;
        }

        matches.forEach(match => {
            const food = this.foodManager.getFoodItem(match.foodId);
            const person = this.personManager.getPerson(match.personId);
            
            if (food && person) {
                const matchCard = this.createMatchCard(food, person);
                container.appendChild(matchCard);
            }
        });
    }

    /**
     * Create match card
     * @param {FoodItem} food - Food item
     * @param {Person} person - Person
     * @returns {HTMLElement} Match card
     */
    createMatchCard(food, person) {
        const card = document.createElement('div');
        card.className = 'match-card';
        
        const safetyScore = food.safetyScore;
        const safetyClass = safetyScore ? safetyScore.letterGrade : 'unknown';
        const safetyText = safetyScore ? safetyScore.letterGrade : '?';
        
        card.innerHTML = `
            <h3>🍽️ ${food.name} → ${person.name}</h3>
            <p><strong>Restaurant:</strong> ${food.restaurantName}</p>
            <p><strong>Food Type:</strong> ${food.type} | <strong>Temperature:</strong> ${food.temperature}°F</p>
            <p><strong>Safety Score:</strong> <span class="safety-score ${safetyClass}">${safetyText}</span></p>
            <p><strong>Person Location:</strong> ${person.location}</p>
            <p><strong>Time Left:</strong> ${food.getTimeUntilExpiration().toFixed(1)} hours</p>
        `;
        
        return card;
    }

    /**
     * Update all displays
     */
    updateDisplay() {
        this.updatePageContent(this.currentPage);
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        // Simple alert for now - could be enhanced with a proper notification system
        alert(message);
    }

    /**
     * Find matches between food and people
     */
    findMatches() {
        this.foodManager.updateAllSafetyScores(this.safetyCalculator);
        const matches = this.matcher.findMatches(this.foodManager, this.personManager);
        
        this.updateDisplay();
        
        if (matches.length > 0) {
            this.showNotification(`Found ${matches.length} matches!`, 'success');
            this.showPage('matches');
        } else {
            this.showNotification('No matches found. Try adding more food or people.', 'info');
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.surplusFoodApp = new SurplusFoodApp();
});