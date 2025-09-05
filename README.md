# Surplus Food App Prototype 📱

A **mobile-first** web application that matches surplus food with people who need it, featuring a comprehensive safety scoring system. Optimized for mobile phones with a design inspired by Uber Eats and Foodpanda.

## Features

### 🍽️ Mobile-First Design
- **Sidebar Navigation**: Easy-to-use hamburger menu for mobile navigation
- **Restaurant-Focused Interface**: Main page displays restaurants like Uber Eats/Foodpanda
- **Touch-Optimized**: All interactions designed for mobile touch screens
- **Responsive Cards**: Food items displayed as restaurant cards with safety scores
- **Search & Filter**: Mobile-friendly search and filtering system

### 🛡️ Safety Score System (A-F Rating)
- **Temperature Monitoring**: Continuous tracking ensures food stays within safe temperature ranges
- **Time Since Preparation**: Algorithm calculates freshness based on food type and elapsed time
- **Handling Compliance**: Restaurant adherence to platform safety protocols and staff training
- **Storage Conditions**: Environmental factors like humidity and contamination risk assessment

### 🎯 Core Functionality
- Add surplus food items with detailed safety information
- Register people looking for food with preferences and restrictions
- Intelligent matching algorithm that considers safety, preferences, and urgency
- Real-time safety score calculation and display
- Mobile-optimized forms and interactions

## Project Structure

```
SurplusFoodAppPrototype/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # CSS styling
├── js/
│   ├── modules/
│   │   ├── safetyScore.js # Safety score calculation module
│   │   ├── foodItem.js    # Food item data model and management
│   │   ├── person.js      # Person data model and management
│   │   └── matcher.js     # Matching algorithm
│   └── app.js             # Main application controller
└── README.md              # This file
```

## Modules

### SafetyScoreCalculator
- Calculates A-F safety ratings based on multiple factors
- Weighted scoring system for temperature, time, handling, and storage
- Generates detailed score breakdowns and recommendations

### FoodItem & FoodManager
- Manages food items with safety tracking
- Handles availability and expiration monitoring
- Provides statistics and filtering capabilities

### Person & PersonManager
- Manages people looking for food
- Tracks preferences and dietary restrictions
- Handles matching status and availability

### FoodMatcher
- Intelligent matching algorithm
- Considers safety scores, preferences, and urgency
- Provides match statistics and improvement suggestions

## Usage

### Mobile Experience
1. Open `index.html` on a mobile device or mobile browser
2. Use the hamburger menu (☰) to navigate between pages
3. Browse available food on the main page (restaurant-style cards)
4. Use search and filter buttons to find specific food types
5. Tap on food cards to view details and safety scores
6. Add new food using the "Add Food" page
7. View your matches in the "Matches" section

### Desktop Experience
- The app also works on desktop with a sidebar navigation
- Responsive design adapts to larger screens
- All mobile features are available on desktop

## Safety Score Details

The safety score is calculated using four weighted factors:

- **Temperature (40%)**: Ensures food is within safe temperature ranges
- **Time (30%)**: Considers how long since preparation
- **Handling (20%)**: Staff training and protocol compliance
- **Storage (10%)**: Environmental conditions and contamination risk

## Technical Details

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Architecture**: Modular design with separation of concerns
- **Mobile-First**: Optimized for mobile phones with touch interactions
- **Testing**: Designed for easy unit testing (modules are self-contained)
- **Responsive**: Mobile-first design with CSS Grid and Flexbox
- **Icons**: Font Awesome for consistent iconography
- **Navigation**: Sidebar navigation with overlay for mobile

## Future Enhancements

- Real-time temperature monitoring integration
- GPS-based distance calculations for matching
- Push notifications for urgent matches
- Restaurant dashboard for food management
- User authentication and profiles
- Mobile app development
- Database integration for persistence

## Getting Started

### Mobile Testing
1. Open `index.html` on a mobile device or mobile browser
2. Use browser developer tools to simulate mobile devices
3. Test the mobile interface with `test-mobile.html`

### Desktop Testing
- Open `index.html` in any modern web browser
- The app includes sample data for demonstration purposes

## Browser Compatibility

### Mobile Browsers
- iOS Safari 12+
- Chrome Mobile 60+
- Samsung Internet 8+
- Firefox Mobile 55+

### Desktop Browsers
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Mobile Features

- **Hamburger Menu**: Tap the ☰ button to open navigation
- **Touch Cards**: Tap food cards to view details
- **Swipe Navigation**: Smooth page transitions
- **Search Bar**: Type to filter restaurants and food
- **Filter Buttons**: Quick filter by food type (Hot, Cold, Frozen)
- **Safety Scores**: Color-coded A-F ratings prominently displayed
