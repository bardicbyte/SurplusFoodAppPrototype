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
        this.componentLoader = new ComponentLoader();
        
        this.currentPage = 'restaurants';
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.currentRestaurant = null;
        this.currentMenuCategory = 'all';
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        await this.loadComponents();
        this.setupEventListeners();
        this.loadSampleData();
        this.updateDisplay();
        this.showPage('restaurants');
    }

    /**
     * Load all HTML components
     */
    async loadComponents() {
        try {
            // Load header and sidebar
            await this.componentLoader.insertComponent('header-container', 'header');
            await this.componentLoader.insertComponent('sidebar-container', 'sidebar');
            
            // Load all pages
            await this.componentLoader.insertComponent('pages-container', 'restaurants-page');
            await this.componentLoader.appendComponent('pages-container', 'menu-page');
            await this.componentLoader.appendComponent('pages-container', 'orders-page');
            await this.componentLoader.appendComponent('pages-container', 'add-food-page');
            await this.componentLoader.appendComponent('pages-container', 'matches-page');
            await this.componentLoader.appendComponent('pages-container', 'profile-page');
            
            // Load floating button
            await this.componentLoader.insertComponent('floating-button-container', 'floating-button');
            
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    /**
     * Set up event listeners for mobile interface
     */
    setupEventListeners() {
        // Use event delegation for dynamically loaded components
        document.addEventListener('click', (e) => {
            // Sidebar controls
            if (e.target.closest('#menuToggle')) {
                this.toggleSidebar();
            } else if (e.target.closest('#closeSidebar') || e.target.closest('#overlay')) {
                this.closeSidebar();
            }
            
            // Navigation links
            if (e.target.closest('.nav-link')) {
                e.preventDefault();
                const link = e.target.closest('.nav-link');
                const page = link.getAttribute('data-page');
                this.showPage(page);
                this.closeSidebar();
            }
            
            // Profile button
            if (e.target.closest('#profileBtn')) {
                this.showPage('profile');
            }
            
            // Floating action button
            if (e.target.closest('#floatingAddBtn')) {
                this.showPage('add-food');
            }
            
            // Back to restaurants button
            if (e.target.closest('#backToRestaurants')) {
                this.showPage('restaurants');
            }
            
            // Filter buttons
            if (e.target.closest('.filter-btn')) {
                const btn = e.target.closest('.filter-btn');
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.getAttribute('data-filter');
                this.updateDisplay();
            }
            
            // Menu category buttons
            if (e.target.closest('.category-btn')) {
                const btn = e.target.closest('.category-btn');
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentMenuCategory = btn.getAttribute('data-category');
                this.updateMenuDisplay();
            }
        });

        // Search functionality
        document.addEventListener('input', (e) => {
            if (e.target.id === 'searchInput') {
                this.searchQuery = e.target.value;
                this.updateDisplay();
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'foodForm') {
                e.preventDefault();
                this.handleFoodFormSubmit();
            }
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
            case 'restaurants':
                this.updateRestaurantDisplay();
                break;
            case 'menu':
                this.updateMenuDisplay();
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
        
        // Go back to restaurants page
        this.showPage('restaurants');
    }

    /**
     * Update restaurant display (main page)
     */
    updateRestaurantDisplay() {
        const container = document.getElementById('restaurantList');
        const restaurants = this.getRestaurantsFromFood();

        // Apply search filter
        let filteredRestaurants = restaurants;
        if (this.searchQuery) {
            filteredRestaurants = restaurants.filter(restaurant => 
                restaurant.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                restaurant.location.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        // Apply type filter
        if (this.currentFilter !== 'all') {
            filteredRestaurants = filteredRestaurants.filter(restaurant => 
                restaurant.foodItems.some(food => food.type === this.currentFilter)
            );
        }

        container.innerHTML = '';

        if (filteredRestaurants.length === 0) {
            container.innerHTML = '<div class="no-items">No restaurants available</div>';
            return;
        }

        filteredRestaurants.forEach(restaurant => {
            const restaurantCard = this.createRestaurantCard(restaurant);
            container.appendChild(restaurantCard);
        });
    }

    /**
     * Create restaurant card for main page
     * @param {Object} restaurant - Restaurant object
     * @returns {HTMLElement} Restaurant card element
     */
    createRestaurantCard(restaurant) {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        
        const avgSafetyScore = this.calculateAverageSafetyScore(restaurant.foodItems);
        const safetyScoreClass = this.getSafetyScoreClass(avgSafetyScore.score);
        const safetyScoreText = Math.round(avgSafetyScore.score);
        
        // Get restaurant image (use first food item's image)
        const restaurantImage = restaurant.foodItems[0]?.image || this.getDefaultFoodImage('hot');
        
        // Count food types
        const typeCounts = {};
        restaurant.foodItems.forEach(food => {
            typeCounts[food.type] = (typeCounts[food.type] || 0) + 1;
        });
        
        const typeText = Object.entries(typeCounts)
            .map(([type, count]) => `${count} ${type}`)
            .join(', ');
        
        card.innerHTML = `
            <div class="food-image" style="background-image: url('${restaurantImage}')">
                <div class="safety-score-badge ${safetyScoreClass}">${safetyScoreText}</div>
            </div>
            
            <div class="restaurant-content">
                <div class="restaurant-header">
                    <div class="restaurant-name">${restaurant.name}</div>
                    <div class="food-name">${restaurant.location}</div>
                </div>
                
                <div class="restaurant-info">
                    <div class="food-type">
                        <i class="fas fa-utensils"></i>
                        ${restaurant.foodItems.length} items
                    </div>
                    <div class="time-left">
                        <i class="fas fa-shield-alt"></i>
                        Safety: ${safetyScoreText}/100
                    </div>
                </div>
                
                <div class="food-details">
                    <div class="temperature">
                        <i class="fas fa-tags"></i>
                        ${typeText}
                    </div>
                    <div class="age">
                        <i class="fas fa-clock"></i>
                        Fresh items available
                    </div>
                </div>
            </div>
        `;
        
        // Add click handler to go to restaurant menu
        card.addEventListener('click', () => {
            this.showRestaurantMenu(restaurant);
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
     * Get safety score class based on numerical score
     * @param {number} score - Safety score (0-100)
     * @returns {string} CSS class name
     */
    getSafetyScoreClass(score) {
        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        return 'low';
    }

    /**
     * Get freshness indicator class based on time remaining
     * @param {number} timeLeft - Time left in hours
     * @returns {string} CSS class name
     */
    getFreshnessClass(timeLeft) {
        if (timeLeft >= 2) return 'fresh';
        if (timeLeft >= 1) return 'warning';
        return 'expired';
    }

    /**
     * Show restaurant menu
     * @param {Object} restaurant - Restaurant object
     */
    showRestaurantMenu(restaurant) {
        this.currentRestaurant = restaurant;
        
        // Update menu header
        document.getElementById('menuRestaurantName').textContent = restaurant.name;
        document.getElementById('menuRestaurantLocation').textContent = restaurant.location;
        
        // Show menu page
        this.showPage('menu');
    }

    /**
     * Update menu display
     */
    updateMenuDisplay() {
        if (!this.currentRestaurant) return;
        
        const container = document.getElementById('menuItems');
        let foodItems = this.currentRestaurant.foodItems;

        // Apply category filter
        if (this.currentMenuCategory !== 'all') {
            foodItems = foodItems.filter(food => food.type === this.currentMenuCategory);
        }

        container.innerHTML = '';

        if (foodItems.length === 0) {
            container.innerHTML = '<div class="no-items">No items available in this category</div>';
            return;
        }

        foodItems.forEach(food => {
            const menuItem = this.createMenuItem(food);
            container.appendChild(menuItem);
        });
    }

    /**
     * Create menu item
     * @param {FoodItem} food - Food item
     * @returns {HTMLElement} Menu item element
     */
    createMenuItem(food) {
        const item = document.createElement('div');
        item.className = 'menu-item';
        
        const safetyScore = food.safetyScore;
        const safetyScoreText = safetyScore ? Math.round(safetyScore.score) : 0;
        const safetyScoreClass = this.getSafetyScoreClass(safetyScoreText);
        
        const timeLeft = food.getTimeUntilExpiration();
        const freshnessClass = this.getFreshnessClass(timeLeft);
        
        item.innerHTML = `
            <div class="menu-item-header">
                <h3 class="menu-item-name">${food.name}</h3>
                <div class="freshness-indicator ${freshnessClass}"></div>
            </div>
            
            <div class="menu-item-details">
                <div class="menu-item-stats">
                    <div class="menu-item-stat">
                        <i class="fas fa-thermometer-half"></i>
                        <span>${food.temperature}°F</span>
                    </div>
                    <div class="menu-item-stat">
                        <i class="fas fa-clock"></i>
                        <span>${food.preparationTime}h old</span>
                    </div>
                    <div class="menu-item-stat">
                        <i class="fas fa-hourglass-half"></i>
                        <span>${timeLeft.toFixed(1)}h left</span>
                    </div>
                </div>
                <div class="safety-score-numeric ${safetyScoreClass}">${safetyScoreText}</div>
            </div>
        `;
        
        // Add click handler for food details
        item.addEventListener('click', () => {
            this.showFoodDetails(food);
        });
        
        return item;
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
        const safetyScoreText = safetyScore ? Math.round(safetyScore.score) : 0;
        const safetyScoreClass = this.getSafetyScoreClass(safetyScoreText);
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
                <span class="safety-score-numeric ${safetyScoreClass}">${safetyScoreText}/100</span>
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