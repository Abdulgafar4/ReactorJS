// state/index.js - Main entry point for the state module

import { createStore } from './store.js';
import { createEnhancedContext } from './context.js';
import { createPersistState } from './persist.js';

// Export all state management functionality
export {
  // Global state
  createStore,
  
  // Context system
  createEnhancedContext,
  
  // State persistence
  createPersistState
};