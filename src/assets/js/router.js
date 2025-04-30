// Router for handling page navigation
class Router {
    constructor(containerId) {
        this.contentContainer = document.getElementById(containerId);
        this.currentPage = null;
        this.routes = {
            'home': '/src/pages/homeContainer.html',
            'games': '/src/games/gamesContainer.html',
            'about': '/src/pages/aboutContainer.html',
            'contact': '/src/pages/contactContainer.html'
        };

        // Initialize router
        this.init();
    }

    init() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigateTo(route);
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.route) {
                this.loadContent(e.state.route, false);
            }
        });

        // Load initial page based on URL or default to home
        const initialRoute = this.getRouteFromUrl() || 'home';
        this.navigateTo(initialRoute);
    }

    getRouteFromUrl() {
        const path = window.location.pathname;
        const route = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
        return route || 'home';
    }

    async navigateTo(route) {
        if (this.currentPage === route) return;
        
        // Update URL and browser history
        const url = `${window.location.origin}/${route}`;
        window.history.pushState({ route }, '', url);
        
        await this.loadContent(route);
    }

    async loadContent(route, updateState = true) {
        try {
            // Show loading state
            if (this.contentContainer) {
                this.contentContainer.style.opacity = '0';
            }

            // Fetch the content
            const response = await fetch(this.routes[route]);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();

            // Update the container
            if (this.contentContainer) {
                this.contentContainer.innerHTML = content;
                setTimeout(() => {
                    this.contentContainer.style.opacity = '1';
                }, 50);
            }

            // Initialize page-specific scripts
            this.initializePageScripts(route);
            
            // Update current page
            this.currentPage = route;

            // Update browser history if needed
            if (updateState) {
                window.history.pushState({ route }, '', `/${route}`);
            }

        } catch (error) {
            console.error('Error loading content:', error);
            // Handle error (e.g., show error message to user)
        }
    }

    initializePageScripts(route) {
        // Remove any existing page-specific scripts
        const oldScripts = document.querySelectorAll('script[data-page-script]');
        oldScripts.forEach(script => script.remove());

        // Initialize new scripts based on route
        switch (route) {
            case 'games':
                // Load games scripts
                this.loadScript('../assets/js/games.js');
                this.loadScript('../assets/js/starfield.js');
                break;
            case 'home':
                // Load home scripts
                this.loadScript('../assets/js/starfield.js');
                break;
            // Add other routes as needed
        }
    }

    loadScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.setAttribute('data-page-script', 'true');
        document.body.appendChild(script);
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router('main-content');
}); 