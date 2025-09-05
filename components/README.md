# Components Directory

This directory contains modular HTML components for the Surplus Food App. Each component is a separate HTML file that gets loaded dynamically by the ComponentLoader utility.

## Component Structure

### Core Components
- **header.html** - Mobile header with hamburger menu and profile button
- **sidebar.html** - Navigation sidebar with overlay
- **floating-button.html** - Floating action button for adding food

### Page Components
- **restaurants-page.html** - Main restaurants listing page (home page)
- **menu-page.html** - Restaurant menu view with category filtering
- **orders-page.html** - User orders page
- **add-food-page.html** - Add new food item form
- **matches-page.html** - Food matches page
- **profile-page.html** - User profile page

## Component Loading

Components are loaded dynamically using the `ComponentLoader` utility:

```javascript
// Load a single component
await componentLoader.loadComponent('header');

// Load multiple components
await componentLoader.loadComponents(['header', 'sidebar', 'restaurants-page']);

// Insert component into DOM
await componentLoader.insertComponent('header-container', 'header');
```

## Benefits of Component Structure

1. **Modularity** - Each component is self-contained and reusable
2. **Maintainability** - Easy to update individual components without affecting others
3. **Performance** - Components are cached after first load
4. **Scalability** - Easy to add new pages or modify existing ones
5. **Separation of Concerns** - HTML structure separated from JavaScript logic

## Error Handling

The ComponentLoader includes fallback content for each component type if loading fails, ensuring the app remains functional even with network issues.

## File Naming Convention

- Use kebab-case for file names (e.g., `restaurants-page.html`)
- Keep component names descriptive and consistent
- Include the component type in the name when applicable (e.g., `-page`, `-modal`)

## Adding New Components

1. Create the HTML file in this directory
2. Add the component loading logic to `app.js`
3. Update event listeners if needed
4. Test the component loading and functionality
