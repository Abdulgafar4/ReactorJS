// router/index.js - Main entry point for the router module

import { FileRouter, DefaultNotFound } from './file-router.js';
import { Link } from './link.js';
import { hydrate } from '../server/ssr.js';

// Export all router functionality
export {
  // File-based router
  FileRouter,
  DefaultNotFound,
  
  // Navigation components
  Link,
  
  // Client-side hydration (re-exported from server)
  hydrate
};