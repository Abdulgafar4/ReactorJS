// server/api.js - API route handling

/**
 * API Router for handling server-side API routes
 * Similar to Next.js API Routes
 */
class ApiRouter {
    constructor() {
      this.routes = {
        GET: {},
        POST: {},
        PUT: {},
        PATCH: {},
        DELETE: {}
      };
      this.middleware = [];
    }
    
    /**
     * Register a GET route handler
     */
    get(path, handler) {
      this.routes.GET[this.normalizePath(path)] = handler;
      return this;
    }
    
    /**
     * Register a POST route handler
     */
    post(path, handler) {
      this.routes.POST[this.normalizePath(path)] = handler;
      return this;
    }
    
    /**
     * Register a PUT route handler
     */
    put(path, handler) {
      this.routes.PUT[this.normalizePath(path)] = handler;
      return this;
    }
    
    /**
     * Register a PATCH route handler
     */
    patch(path, handler) {
      this.routes.PATCH[this.normalizePath(path)] = handler;
      return this;
    }
    
    /**
     * Register a DELETE route handler
     */
    delete(path, handler) {
      this.routes.DELETE[this.normalizePath(path)] = handler;
      return this;
    }
    
    /**
     * Register middleware to be applied to all routes
     */
    use(middleware) {
      this.middleware.push(middleware);
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
     * Parse dynamic route parameters
     */
    parseParams(routePath, requestPath) {
      const routeParts = routePath.split('/').filter(Boolean);
      const requestParts = requestPath.split('/').filter(Boolean);
      
      if (routeParts.length !== requestParts.length) return null;
      
      const params = {};
      
      for (let i = 0; i < routeParts.length; i++) {
        const routePart = routeParts[i];
        const requestPart = requestParts[i];
        
        if (routePart.startsWith('[') && routePart.endsWith(']')) {
          // Dynamic segment - extract parameter name and value
          const paramName = routePart.slice(1, -1);
          params[paramName] = decodeURIComponent(requestPart);
        } else if (routePart !== requestPart) {
          // Static segment mismatch
          return null;
        }
      }
      
      return params;
    }
    
    /**
     * Find matching route for a request
     */
    findRoute(method, path) {
      const normalizedPath = this.normalizePath(path);
      
      // Check for exact match
      if (this.routes[method][normalizedPath]) {
        return {
          handler: this.routes[method][normalizedPath],
          params: {}
        };
      }
      
      // Check for dynamic routes
      for (const routePath in this.routes[method]) {
        if (routePath.includes('[') && routePath.includes(']')) {
          const params = this.parseParams(routePath, normalizedPath);
          if (params) {
            return {
              handler: this.routes[method][routePath],
              params
            };
          }
        }
      }
      
      return null;
    }
    
    /**
     * Handle an API request
     */
    async handleRequest(req, res) {
      const { method, url } = req;
      const parsedUrl = new URL(url, `http://${req.headers.host}`);
      const path = parsedUrl.pathname;
      
      const route = this.findRoute(method, path);
      
      if (!route) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
      }
      
      const { handler, params } = route;
      
      // Create request context
      const context = {
        req,
        res,
        params,
        query: Object.fromEntries(parsedUrl.searchParams)
      };
      
      try {
        // Apply middleware
        for (const middleware of this.middleware) {
          await new Promise((resolve, reject) => {
            middleware(req, res, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
          
          // If response is already sent by middleware, stop processing
          if (res.writableEnded) return;
        }
        
        // Call the route handler
        await handler(req, res, context);
        
        // If handler didn't end the response, do it
        if (!res.writableEnded) {
          if (!res.statusCode) res.statusCode = 200;
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json');
          }
          res.end();
        }
      } catch (error) {
        // Handle errors
        console.error('API Route Error:', error);
        
        if (!res.writableEnded) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ 
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'production' 
              ? 'An error occurred processing your request'
              : error.message
          }));
        }
      }
    }
    
    /**
     * Create an Express-compatible middleware
     */
    createMiddleware() {
      return (req, res, next) => {
        // Only handle /api/* routes
        if (!req.url.startsWith('/api/')) {
          return next();
        }
        
        this.handleRequest(req, res).catch(next);
      };
    }
  }
  
  export { ApiRouter };