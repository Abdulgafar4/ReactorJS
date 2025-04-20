// router/file-router.js - File-based routing implementation

import { createElement } from '../core/vdom.js';
import { Component } from '../core/component.js';
import { render } from '../core/renderer.js';

/**
 * Default 404 page component
 */
class DefaultNotFound extends Component {
  render() {
    return createElement('div', { style: {
      fontFamily: 'sans-serif',
      maxWidth: '600px',
      margin: '100px auto',
      textAlign: 'center'
    }},
      createElement('h1', null, '404 - Page Not Found'),
      createElement('p', null, 'The page you are looking for does not exist.')
    );
  }
}

/**
 * File-based router implementation
 * Provides automatic routing based on file structure or explicit route registration
 */
class FileRouter {
  constructor(options = {}) {
    this.routes = {};
    this.layouts = {};
    this.notFoundComponent = options.notFoundComponent || DefaultNotFound;
    this.currentRoute = null;
    this.container = null;
    this.params = {};
    this.query = {};
    this.history = [];
    this.historyIndex = -1;
    
    // Listen for navigation events in browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', this.handleLocationChange.bind(this));
      
      // Intercept link clicks for client-side routing
      document.addEventListener('click', e => {
        // Only handle link clicks with left mouse button
        if (e.button !== 0) return;
        
        // Find the closest anchor element
        let target = e.target;
        while (target && target.tagName !== 'A') {
          target = target.parentNode;
        }
        
        if (target && target.tagName === 'A') {
          const href = target.getAttribute('href');
          // Only handle internal links with no target or _self target
          if (href && 
              href.startsWith('/') && 
              (!target.getAttribute('target') || target.getAttribute('target') === '_self')) {
            e.preventDefault();
            this.navigate(href);
          }
        }
      });
    }
  }
  
  /**
   * Register a page component for a specific route
   */
  registerPage(path, component, options = {}) {
    this.routes[this.normalizePath(path)] = { component, options };
    return this;
  }
  
  /**
   * Register a layout component for a specific route path
   */
  registerLayout(path, component) {
    this.layouts[this.normalizePath(path)] = component;
    return this;
  }
  
  /**
   * Set the component to use for 404 not found pages
   */
  setNotFoundPage(component) {
    this.notFoundComponent = component;
    return this;
  }
  
  /**
   * Normalize path to ensure consistency
   */
  normalizePath(path) {
    // Ensure path starts with a slash
    path = path.startsWith('/') ? path : `/${path}`;
    // Remove trailing slash except for root path
    path = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
    return path;
  }
  
  /**
   * Mount the router to a DOM container
   */
  mount(container) {
    this.container = container;
    this.handleLocationChange();
    return this;
  }
  
  /**
   * Navigate to a new page
   */
  navigate(path, options = {}) {
    const url = new URL(path, window.location.origin);
    const fullPath = url.pathname + url.search;
    
    if (options.replace) {
      window.history.replaceState(null, '', fullPath);
    } else {
      window.history.pushState(null, '', fullPath);
      
      // Store in history stack
      if (this.historyIndex < this.history.length - 1) {
        // Remove future history if navigating from a previous point
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      this.history.push(fullPath);
      this.historyIndex = this.history.length - 1;
    }
    
    this.handleLocationChange();
  }
  
  /**
   * Navigate back in history
   */
  back() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const previousPath = this.history[this.historyIndex];
      window.history.pushState(null, '', previousPath);
      this.handleLocationChange();
    } else {
      window.history.back();
    }
  }
  
  /**
   * Navigate forward in history
   */
  forward() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const nextPath = this.history[this.historyIndex];
      window.history.pushState(null, '', nextPath);
      this.handleLocationChange();
    } else {
      window.history.forward();
    }
  }
  
  /**
   * Parse URL parameters from path pattern
   * e.g. /users/[id] matches /users/123 with params { id: '123' }
   */
  parseParams(routePath, currentPath) {
    const routeParts = routePath.split('/').filter(Boolean);
    const pathParts = currentPath.split('/').filter(Boolean);
    
    if (routeParts.length !== pathParts.length) return null;
    
    const params = {};
    
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];
      
      if (routePart.startsWith('[') && routePart.endsWith(']')) {
        // Dynamic segment - extract parameter name and value
        const paramName = routePart.slice(1, -1);
        params[paramName] = decodeURIComponent(pathPart);
      } else if (routePart !== pathPart) {
        // Static segment mismatch
        return null;
      }
    }
    
    return params;
  }
  
  /**
   * Parse query parameters from URL
   */
  parseQuery(url) {
    const query = {};
    const searchParams = new URLSearchParams(url.search);
    
    for (const [key, value] of searchParams.entries()) {
      query[key] = value;
    }
    
    return query;
  }
  
  /**
   * Find a matching route for the given path
   */
  findRoute(path) {
    const url = new URL(path, window.location.origin);
    const pathname = this.normalizePath(url.pathname);
    
    // First check exact matches
    if (this.routes[pathname]) {
      return {
        route: this.routes[pathname],
        params: {},
        query: this.parseQuery(url)
      };
    }
    
    // Then try dynamic routes with parameters
    for (const routePath in this.routes) {
      if (routePath.includes('[') && routePath.includes(']')) {
        const params = this.parseParams(routePath, pathname);
        if (params) {
          return {
            route: this.routes[routePath],
            params,
            query: this.parseQuery(url)
          };
        }
      }
    }
    
    // No matching route found
    return {
      route: { component: this.notFoundComponent, options: {} },
      params: {},
      query: this.parseQuery(url),
      notFound: true
    };
  }
  
  /**
   * Find all layouts that apply to this route
   */
  findLayouts(path) {
    const url = new URL(path, window.location.origin);
    const pathname = this.normalizePath(url.pathname);
    const parts = pathname.split('/').filter(Boolean);
    const layouts = [];
    
    // Check root layout
    if (this.layouts['/']) {
      layouts.push(this.layouts['/']);
    }
    
    // Check nested layouts
    let currentPath = '';
    for (const part of parts) {
      currentPath += `/${part}`;
      if (this.layouts[currentPath]) {
        layouts.push(this.layouts[currentPath]);
      }
    }
    
    return layouts;
  }
  
  /**
   * Handle location changes (navigate or back/forward)
   */
  handleLocationChange() {
    if (!this.container) return;
    
    const path = window.location.pathname + window.location.search;
    const { route, params, query, notFound } = this.findRoute(path);
    const layouts = this.findLayouts(path);
    
    this.params = params;
    this.query = query;
    
    // Remember current route for future reference
    this.currentRoute = {
      path,
      component: route.component,
      params,
      query,
      notFound,
      layouts
    };
    
    // Fetch initial data if needed
    this.loadPageData().then(pageProps => {
      this.renderPage(pageProps);
    });
  }
  
  /**
   * Load data for the current page
   */
  async loadPageData() {
    const { component, params, query } = this.currentRoute;
    
    // If component has getInitialProps, call it
    if (component.getInitialProps) {
      try {
        return await component.getInitialProps({
          params,
          query,
          router: this
        });
      } catch (error) {
        console.error('Error loading page data:', error);
        return { error };
      }
    }
    
    return {};
  }
  
  /**
   * Render the current page with layouts
   */
  renderPage(pageProps = {}) {
    const { component: PageComponent, params, query, layouts } = this.currentRoute;
    
    // Create page element
    let element = createElement(PageComponent, {
      params,
      query,
      router: this,
      ...pageProps
    });
    
    // Wrap in layouts (from most specific to most general)
    for (let i = layouts.length - 1; i >= 0; i--) {
      const Layout = layouts[i];
      element = createElement(Layout, {
        params,
        query,
        router: this
      }, element);
    }
    
    // Render to container
    render(element, this.container);
  }
}

export { FileRouter, DefaultNotFound };