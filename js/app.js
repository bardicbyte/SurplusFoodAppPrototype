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
        this.cart = [];
        
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
        
        // Find the target page element
        const targetPage = document.querySelector(`[data-page="${pageName}"]`);
        if (targetPage) {
            targetPage.classList.add('active');
        } else {
            console.error(`Page with data-page="${pageName}" not found`);
            return;
        }

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
        // Sample food items with base64 encoded images
        const sampleFood = [
            // Hot Food Items - High savings to show surplus value
            {
                name: 'Chicken Alfredo Pasta',
                restaurantName: 'Mama Mia Restaurant',
                type: 'hot',
                preparationTime: 1.5,
                temperature: 145,
                location: 'Downtown',
                image: foodImages.pasta,
                description: 'Creamy alfredo sauce with tender chicken over perfectly cooked pasta'
            },
            {
                name: 'Beef Stir Fry',
                restaurantName: 'Dragon Palace',
                type: 'hot',
                preparationTime: 3.5,
                temperature: 120,
                location: 'Eastside',
                image: foodImages.teriyaki,
                description: 'Tender beef strips with fresh vegetables in savory sauce'
            },
            {
                name: 'Margherita Pizza',
                restaurantName: 'Pizza Corner',
                type: 'hot',
                preparationTime: 2.5,
                temperature: 135,
                location: 'Westside',
                image: foodImages.pizza,
                description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
            },
            {
                name: 'Fish & Chips',
                restaurantName: 'The British Pub',
                type: 'hot',
                preparationTime: 4,
                temperature: 110,
                location: 'Old Town',
                image: foodImages.fishChips,
                description: 'Crispy battered fish with golden chips and mushy peas'
            },
            {
                name: 'Chicken Teriyaki Bowl',
                restaurantName: 'Tokyo Express',
                type: 'hot',
                preparationTime: 2,
                temperature: 140,
                location: 'Chinatown',
                image: foodImages.teriyaki,
                description: 'Grilled chicken with teriyaki sauce over steamed rice'
            },
            {
                name: 'Grilled Salmon',
                restaurantName: 'Ocean Breeze',
                type: 'hot',
                preparationTime: 2.5,
                temperature: 150,
                location: 'Harbor District',
                image: foodImages.salmon,
                description: 'Fresh Atlantic salmon with herbs and lemon'
            },
            {
                name: 'BBQ Ribs',
                restaurantName: 'Smokehouse Grill',
                type: 'hot',
                preparationTime: 3,
                temperature: 160,
                location: 'Downtown',
                image: foodImages.teriyaki,
                description: 'Slow-cooked ribs with tangy BBQ sauce'
            },
            {
                name: 'Chicken Wings',
                restaurantName: 'Sports Bar',
                type: 'hot',
                preparationTime: 1.5,
                temperature: 155,
                location: 'Midtown',
                image: foodImages.teriyaki,
                description: 'Crispy wings with buffalo sauce'
            },
            
            // Cold Food Items - Good savings on fresh items
            {
                name: 'Caesar Salad',
                restaurantName: 'Green Garden Cafe',
                type: 'cold',
                preparationTime: 0.5,
                temperature: 38,
                location: 'Midtown',
                image: foodImages.salad,
                description: 'Fresh romaine lettuce with parmesan cheese and croutons'
            },
            {
                name: 'Fresh Fruit Bowl',
                restaurantName: 'Healthy Bites',
                type: 'cold',
                preparationTime: 1,
                temperature: 40,
                location: 'Downtown',
                image: foodImages.fruitBowl,
                description: 'Seasonal fresh fruits including berries, melon, and citrus'
            },
            {
                name: 'Mediterranean Wrap',
                restaurantName: 'Sunshine Cafe',
                type: 'cold',
                preparationTime: 0.8,
                temperature: 42,
                location: 'Riverside',
                image: foodImages.wrap,
                description: 'Fresh vegetables, hummus, and feta in a soft tortilla wrap'
            },
            {
                name: 'Greek Yogurt Parfait',
                restaurantName: 'Healthy Bites',
                type: 'cold',
                preparationTime: 0.3,
                temperature: 35,
                location: 'Downtown',
                image: foodImages.yogurt,
                description: 'Layered yogurt with fresh berries and granola'
            },
            {
                name: 'Quinoa Bowl',
                restaurantName: 'Green Garden Cafe',
                type: 'cold',
                preparationTime: 1.2,
                temperature: 45,
                location: 'Midtown',
                image: foodImages.salad,
                description: 'Nutritious quinoa with roasted vegetables and tahini dressing'
            },
            {
                name: 'Turkey Sandwich',
                restaurantName: 'Sunshine Cafe',
                type: 'cold',
                preparationTime: 0.5,
                temperature: 40,
                location: 'Riverside',
                image: foodImages.wrap,
                description: 'Fresh turkey with lettuce, tomato, and mayo on artisan bread'
            },
            
            // Frozen Food Items - Great savings on desserts
            {
                name: 'Chocolate Ice Cream',
                restaurantName: 'Sweet Treats',
                type: 'frozen',
                preparationTime: 2,
                temperature: 15,
                location: 'Uptown',
                image: foodImages.iceCream,
                description: 'Rich and creamy chocolate ice cream with chocolate chips'
            },
            {
                name: 'Vanilla Ice Cream',
                restaurantName: 'Sweet Treats',
                type: 'frozen',
                preparationTime: 1.5,
                temperature: 20,
                location: 'Uptown',
                image: foodImages.iceCream,
                description: 'Smooth vanilla ice cream with real vanilla bean specks'
            },
            {
                name: 'Strawberry Cheesecake',
                restaurantName: 'Sweet Treats',
                type: 'frozen',
                preparationTime: 3,
                temperature: 25,
                location: 'Uptown',
                image: foodImages.cheesecake,
                description: 'Creamy cheesecake with fresh strawberry topping'
            },
            {
                name: 'Chocolate Cake',
                restaurantName: 'Sweet Treats',
                type: 'frozen',
                preparationTime: 2.5,
                temperature: 18,
                location: 'Uptown',
                image: foodImages.cheesecake,
                description: 'Rich chocolate cake with chocolate ganache'
            },
            {
                name: 'Frozen Yogurt',
                restaurantName: 'Healthy Bites',
                type: 'frozen',
                preparationTime: 1,
                temperature: 22,
                location: 'Downtown',
                image: foodImages.yogurt,
                description: 'Creamy frozen yogurt with fresh fruit toppings'
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
        
        // Get restaurant image (use first food item's image or default)
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
            <div class="food-image">
                <img src="${restaurantImage}" alt="Restaurant food" class="food-emoji" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="food-emoji" style="display:none; font-size: clamp(60px, 15vw, 120px); line-height: 1; text-align: center;">🍽️</div>
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
            hot: foodImages.pasta,
            cold: foodImages.salad,
            frozen: foodImages.iceCream
        };
        return defaultImages[type] || defaultImages.hot;
    }

    /**
     * Calculate discounted price based on freshness
     * @param {Object} food - Food item
     * @returns {Object} Price information with original and discounted prices
     */
    calculateDiscountedPrice(food) {
        const originalPrice = food.originalPrice || 0;
        const discountedPrice = food.discountedPrice || originalPrice;
        const timeLeft = food.getTimeUntilExpiration();
        
        console.log(`DEBUG: Food ${food.name} - originalPrice: ${originalPrice}, discountedPrice: ${discountedPrice}`);
        
        // Calculate discount percentage from hardcoded prices
        const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;
        
        return {
            original: originalPrice,
            discounted: discountedPrice,
            discountPercent: discountPercent,
            timeLeft: timeLeft
        };
    }

    /**
     * Add item to cart with freshness warning
     * @param {Object} food - Food item to add
     */
    addToCart(food) {
        const priceInfo = this.calculateDiscountedPrice(food);
        
        // Check if item is too old and show warning
        if (priceInfo.timeLeft <= 0) {
            this.showWarning('This item has expired and may not be safe to consume. Are you sure you want to add it to your cart?', () => {
                this.addToCartConfirmed(food, priceInfo);
            });
        } else if (priceInfo.timeLeft <= 1) {
            this.showWarning('This item expires very soon (within 1 hour). Are you sure you want to add it to your cart?', () => {
                this.addToCartConfirmed(food, priceInfo);
            });
        } else {
            this.addToCartConfirmed(food, priceInfo);
        }
    }

    /**
     * Confirm adding item to cart
     * @param {Object} food - Food item
     * @param {Object} priceInfo - Price information
     */
    addToCartConfirmed(food, priceInfo) {
        const cartItem = {
            ...food,
            cartPrice: priceInfo.discounted,
            originalPrice: priceInfo.original,
            discountPercent: priceInfo.discountPercent,
            addedAt: new Date()
        };
        
        this.cart.push(cartItem);
        this.showNotification(`${food.name} added to cart for $${priceInfo.discounted.toFixed(2)}!`);
        this.updateCartDisplay();
    }

    /**
     * Show warning modal
     * @param {string} message - Warning message
     * @param {Function} onConfirm - Callback for confirm action
     */
    showWarning(message, onConfirm) {
        // Create warning modal
        let modal = document.getElementById('warningModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'warningModal';
            modal.className = 'warning-modal';
            modal.innerHTML = `
                <div class="modal-overlay" id="warningOverlay"></div>
                <div class="modal-content">
                    <div class="warning-icon">⚠️</div>
                    <h3>Warning</h3>
                    <p id="warningMessage"></p>
                    <div class="warning-buttons">
                        <button class="btn btn-secondary" id="cancelWarning">Cancel</button>
                        <button class="btn btn-primary" id="confirmWarning">Add to Cart</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add event listeners
            document.getElementById('cancelWarning').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            document.getElementById('confirmWarning').addEventListener('click', () => {
                modal.style.display = 'none';
                onConfirm();
            });
            document.getElementById('warningOverlay').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        document.getElementById('warningMessage').textContent = message;
        modal.style.display = 'flex';
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     */
    showNotification(message) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Update cart display
     */
    updateCartDisplay() {
        // This would update a cart icon or counter
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }
    }

    /**
     * Get safety score class based on numerical score
     * @param {number} score - Safety score (0-100)
     * @returns {string} CSS class name
     */
    getSafetyScoreClass(score) {
        if (score >= 95) return 'excellent';
        if (score >= 85) return 'high';
        if (score >= 75) return 'good';
        if (score >= 65) return 'medium';
        if (score >= 55) return 'fair';
        if (score >= 40) return 'low';
        return 'poor';
    }

    /**
     * Convert numerical score to letter grade
     * @param {number} score - Safety score (0-100)
     * @returns {string} Letter grade (A, B, C, D, F)
     */
    scoreToLetterGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
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
        
        // Calculate pricing
        const priceInfo = this.calculateDiscountedPrice(food);
        
        item.innerHTML = `
            <div class="menu-item-header">
                <h3 class="menu-item-name">${food.name}</h3>
                <div class="freshness-container">
                    <div class="freshness-indicator ${freshnessClass}" title="Freshness Level: ${freshnessClass === 'fresh' ? 'Fresh' : freshnessClass === 'warning' ? 'Expiring Soon' : 'Expired'}"></div>
                    <i class="fas fa-question-circle help-icon" title="Freshness Status: Green = Fresh, Yellow = Expiring Soon, Red = Expired. Set by restaurant for each item."></i>
                </div>
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
                        <i class="fas fa-question-circle help-icon" title="Restaurant-specific freshness rating for this menu item. Shorter times mean bigger discounts!"></i>
                    </div>
                </div>
                <div class="safety-score-container">
                    <div class="safety-score-numeric ${safetyScoreClass}">${safetyScoreText}</div>
                    <i class="fas fa-question-circle help-icon" title="Safety Score (0-100): Community-based rating from user reviews, hygiene standards, and other factors. Higher scores = more trusted restaurant."></i>
                </div>
            </div>
            
            <div class="menu-item-pricing">
                <div class="price-info">
                    ${priceInfo.discountPercent > 0 ? `
                        <div class="original-price">$${priceInfo.original.toFixed(2)}</div>
                        <div class="discounted-price">$${priceInfo.discounted.toFixed(2)}</div>
                        <div class="savings-info">
                            <div class="discount-badge">${priceInfo.discountPercent}% OFF</div>
                            <div class="you-save">You save $${(priceInfo.original - priceInfo.discounted).toFixed(2)}!</div>
                        </div>
                    ` : `
                        <div class="regular-price">$${priceInfo.original.toFixed(2)}</div>
                    `}
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); window.surplusFoodApp.addToCart(this.foodData)">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        `;
        
        // Store food data for the button
        item.querySelector('.add-to-cart-btn').foodData = food;
        
        // Add click handler for food details (but not on the button)
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-cart-btn')) {
                this.showFoodDetails(food);
            }
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
        
        const foodImage = food.image || this.getDefaultFoodImage(food.type);
        modal.querySelector('.food-detail-image').innerHTML = 
            `<img src="${foodImage}" alt="${food.name}" class="food-emoji" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="food-emoji" style="display:none; font-size: clamp(60px, 15vw, 120px); line-height: 1; text-align: center;">🍽️</div>`;
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

        // Limit to 6 restaurants and add variation to safety scores
        const restaurantArray = Array.from(restaurants.values()).slice(0, 6);
        
        // Add variation to each restaurant's safety scores
        restaurantArray.forEach((restaurant, index) => {
            // Create a base safety score variation for each restaurant (75-95 range)
            const baseScore = 75 + (index * 3) + Math.random() * 5;
            
            // Modify each food item's safety score for this restaurant
            restaurant.foodItems.forEach(food => {
                if (food.safetyScore) {
                    // Add variation to the safety score (±10 points)
                    const variation = (Math.random() - 0.5) * 20;
                    const newScore = Math.max(0, Math.min(100, food.safetyScore.score + variation));
                    
                    // Update the safety score
                    food.safetyScore.score = newScore;
                    food.safetyScore.letterGrade = this.scoreToLetterGrade(newScore);
                }
            });
        });

        return restaurantArray;
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
    
    // Test random price generation
    console.log('=== TESTING RANDOM PRICE GENERATION ===');
    const testFood = new FoodItem({
        name: 'Test Item',
        restaurantName: 'Test Restaurant',
        type: 'hot',
        preparationTime: 1,
        temperature: 100
    });
    console.log('Test food item:', testFood);
    console.log('Original Price:', testFood.originalPrice);
    console.log('Discounted Price:', testFood.discountedPrice);
});