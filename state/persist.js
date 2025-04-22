// state/persist.js - State persistence utilities

/**
 * Options for state persistence
 * @typedef {Object} PersistOptions
 * @property {string} key - Storage key
 * @property {string} [storage='localStorage'] - Storage type ('localStorage' or 'sessionStorage')
 * @property {Array<string>} [whitelist] - Keys to include in persistence
 * @property {Array<string>} [blacklist] - Keys to exclude from persistence
 * @property {function} [serialize] - Custom serialization function
 * @property {function} [deserialize] - Custom deserialization function
 * @property {number} [version] - State version for migrations
 * @property {Object} [migrations] - Version migration functions
 */

/**
 * Creates a persistence enhancer for a store
 * @param {PersistOptions} options - Persistence options
 * @returns {function} Store enhancer
 */
function createPersistState(options = {}) {
    const {
      key = 'clyra_state',
      storage = 'localStorage',
      whitelist = null,
      blacklist = null,
      serialize = JSON.stringify,
      deserialize = JSON.parse,
      version = 1,
      migrations = {}
    } = options;
    
    // Get storage object
    const storageObj = typeof window !== 'undefined' ? window[storage] : null;
    
    if (!storageObj) {
      console.warn(`${storage} is not available. State persistence will be disabled.`);
      return store => store;
    }
    
    /**
     * Filter state based on whitelist/blacklist
     */
    function filterState(state) {
      if (!state) return state;
      
      if (whitelist && Array.isArray(whitelist)) {
        return whitelist.reduce((result, key) => {
          if (key in state) {
            result[key] = state[key];
          }
          return result;
        }, {});
      }
      
      if (blacklist && Array.isArray(blacklist)) {
        return Object.keys(state).reduce((result, key) => {
          if (!blacklist.includes(key)) {
            result[key] = state[key];
          }
          return result;
        }, {});
      }
      
      return state;
    }
    
    /**
     * Save state to storage
     */
    function saveState(state) {
      try {
        const filteredState = filterState(state);
        const persistedState = {
          version,
          state: filteredState
        };
        
        storageObj.setItem(key, serialize(persistedState));
      } catch (err) {
        console.error('Error saving state to storage:', err);
      }
    }
    
    /**
     * Load state from storage
     */
    function loadState() {
      try {
        const serializedState = storageObj.getItem(key);
        
        if (!serializedState) {
          return undefined;
        }
        
        const { version: savedVersion, state } = deserialize(serializedState);
        
        // Handle migrations if needed
        if (savedVersion !== version && migrations[savedVersion]) {
          return migrations[savedVersion](state);
        }
        
        return state;
      } catch (err) {
        console.error('Error loading state from storage:', err);
        return undefined;
      }
    }
    
    /**
     * Clear persisted state
     */
    function clearPersistedState() {
      try {
        storageObj.removeItem(key);
      } catch (err) {
        console.error('Error clearing persisted state:', err);
      }
    }
    
    /**
     * Enhances a store with persistence capabilities
     */
    return function enhanceStore(createStore) {
      return function (options) {
        // Load saved state
        const savedState = loadState();
        
        // Create store with saved state
        const store = createStore({
          ...options,
          initialState: {
            ...options.initialState,
            ...savedState
          }
        });
        
        // Subscribe to state changes to persist them
        store.subscribe(() => {
          saveState(store.getState());
        });
        
        // Add persistence methods to store
        return {
          ...store,
          clearPersistedState
        };
      };
    };
  }
  
  export { createPersistState };