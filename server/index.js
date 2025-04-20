// server/index.js - Main entry point for the server module

import {
    renderToString,
    renderToDocument,
    createServerApp,
    hydrate
  } from './ssr.js';
  
  import { ApiRouter } from './api.js';
  import { StaticSiteGenerator, createStaticSiteGenerator } from './ssg.js';
  
  // Export all server functionality
  export {
    // Server-side rendering
    renderToString,
    renderToDocument,
    createServerApp,
    
    // Client-side hydration
    hydrate,
    
    // API routes
    ApiRouter,
    
    // Static site generation
    StaticSiteGenerator,
    createStaticSiteGenerator
  };