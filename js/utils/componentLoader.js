/**
 * Component Loader Utility
 * Loads HTML components dynamically
 */
class ComponentLoader {
    constructor() {
        this.loadedComponents = new Map();
    }

    /**
     * Load a component from file
     * @param {string} componentName - Name of the component file (without .html)
     * @returns {Promise<string>} HTML content
     */
    async loadComponent(componentName) {
        if (this.loadedComponents.has(componentName)) {
            return this.loadedComponents.get(componentName);
        }

        try {
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to load component: ${componentName}`);
            }
            
            const html = await response.text();
            if (!html.trim()) {
                throw new Error(`Empty component file: ${componentName}`);
            }
            
            this.loadedComponents.set(componentName, html);
            return html;
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
            
            // Return appropriate fallback based on component type
            switch (componentName) {
                case 'header':
                    return '<header class="mobile-header"><h1>🍽️ Surplus Food</h1></header>';
                case 'sidebar':
                    return '<nav class="sidebar"><div class="sidebar-header"><h2>Menu</h2></div></nav>';
                case 'restaurants-page':
                    return '<div class="page active"><div class="no-items">Restaurants page failed to load</div></div>';
                default:
                    return `<div class="error">Failed to load ${componentName} component</div>`;
            }
        }
    }

    /**
     * Load multiple components
     * @param {Array<string>} componentNames - Array of component names
     * @returns {Promise<Object>} Object with component names as keys and HTML as values
     */
    async loadComponents(componentNames) {
        const promises = componentNames.map(name => 
            this.loadComponent(name).then(html => ({ name, html }))
        );
        
        const results = await Promise.all(promises);
        const components = {};
        
        results.forEach(({ name, html }) => {
            components[name] = html;
        });
        
        return components;
    }

    /**
     * Insert component HTML into an element
     * @param {string} elementId - ID of the target element
     * @param {string} componentName - Name of the component
     */
    async insertComponent(elementId, componentName) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with ID ${elementId} not found`);
            return;
        }

        const html = await this.loadComponent(componentName);
        element.innerHTML = html;
    }

    /**
     * Append component HTML to an element
     * @param {string} elementId - ID of the target element
     * @param {string} componentName - Name of the component
     */
    async appendComponent(elementId, componentName) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with ID ${elementId} not found`);
            return;
        }

        const html = await this.loadComponent(componentName);
        element.insertAdjacentHTML('beforeend', html);
    }

    /**
     * Clear loaded components cache
     */
    clearCache() {
        this.loadedComponents.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentLoader;
}
