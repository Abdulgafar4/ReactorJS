// server/ssg.js - Static site generation

import fs from 'fs';
import path from 'path';
import { createServerApp, renderToDocument } from './ssr.js';

/**
 * Generates static HTML files for specified routes
 * Similar to Next.js static site generation
 */
class StaticSiteGenerator {
  constructor(options = {}) {
    this.options = {
      outDir: options.outDir || 'dist',
      routes: options.routes || [],
      pages: options.pages || {},
      layouts: options.layouts || {},
      notFound: options.notFound,
      title: options.title || 'Clyra App',
      styles: options.styles || '',
      scripts: options.scripts || '',
      head: options.head || '',
      ...options
    };
    
    this.serverApp = createServerApp({
      pages: this.options.pages,
      layouts: this.options.layouts,
      notFound: this.options.notFound,
      title: this.options.title,
      styles: this.options.styles,
      scripts: this.options.scripts,
      head: this.options.head
    });
  }
  
  /**
   * Get all routes to be statically generated
   */
  async getRoutes() {
    // Static routes defined in constructor options
    const staticRoutes = [...this.options.routes];
    
    // Dynamic routes from getStaticPaths
    const dynamicRoutes = [];
    
    // Find pages with getStaticPaths
    for (const [path, component] of Object.entries(this.options.pages)) {
      if (component.getStaticPaths && path.includes('[')) {
        try {
          const pathsData = await component.getStaticPaths();
          
          if (pathsData && Array.isArray(pathsData.paths)) {
            // For each path returned by getStaticPaths
            pathsData.paths.forEach(params => {
              // Replace parameters in route pattern with actual values
              let routePath = path;
              for (const [key, value] of Object.entries(params)) {
                routePath = routePath.replace(`[${key}]`, value);
              }
              
              dynamicRoutes.push({
                path: routePath,
                params
              });
            });
          }
        } catch (error) {
          console.error(`Error calling getStaticPaths for ${path}:`, error);
        }
      }
    }
    
    return [...staticRoutes, ...dynamicRoutes];
  }
  
  /**
   * Create directories recursively
   */
  ensureDirectory(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  /**
   * Generate HTML file path from route path
   */
  getHtmlFilePath(routePath) {
    let filePath = routePath;
    
    // Handle root route
    if (filePath === '/') {
      filePath = '/index';
    }
    
    // Handle paths with trailing slash
    if (filePath.endsWith('/')) {
      filePath = filePath.slice(0, -1) + '/index';
    }
    
    // Add .html extension
    filePath += '.html';
    
    return path.join(this.options.outDir, filePath);
  }
  
  /**
   * Write HTML files for static routes
   */
  async generatePages() {
    const routes = await this.getRoutes();
    
    console.log(`Generating ${routes.length} static pages...`);
    
    // Ensure output directory exists
    this.ensureDirectory(this.options.outDir);
    
    // Generate each route
    for (const route of routes) {
      const routePath = typeof route === 'string' ? route : route.path;
      const params = typeof route === 'string' ? {} : route.params;
      
      try {
        // Render route to HTML
        const { html, statusCode } = await this.serverApp.renderPath(routePath);
        
        if (statusCode === 404 && !this.options.generate404) {
          console.warn(`Skipping 404 page for route: ${routePath}`);
          continue;
        }
        
        // Get file path
        const filePath = this.getHtmlFilePath(routePath);
        
        // Create directory if needed
        this.ensureDirectory(path.dirname(filePath));
        
        // Write HTML file
        fs.writeFileSync(filePath, html);
        
        console.log(`Generated: ${filePath}`);
      } catch (error) {
        console.error(`Error generating page for ${routePath}:`, error);
      }
    }
    
    // Generate 404 page
    if (this.options.generate404) {
      try {
        const { html } = await this.serverApp.renderPath('/404');
        const filePath = path.join(this.options.outDir, '404.html');
        fs.writeFileSync(filePath, html);
        console.log(`Generated: 404.html`);
      } catch (error) {
        console.error('Error generating 404 page:', error);
      }
    }
    
    console.log('Static site generation complete!');
  }
}

/**
 * Creates a static site generator
 */
function createStaticSiteGenerator(options = {}) {
  return new StaticSiteGenerator(options);
}

export { StaticSiteGenerator, createStaticSiteGenerator };