// state/store.js - Global state management (Redux-like)

import { useState, useEffect } from '../core/hooks.js';

/**
 * Creates a global store for state management
 * @param {Object} options - Store options
 * @param {Object} options.initialState - Initial state
 * @param {Object} options.reducers - Reducer functions
 * @returns {Object} Store methods and state
 */
function createStore(options = {}) {
  const {
    initialState = {},
    reducers = {}
  } = options;
  
  // Store state
  let state = { ...initialState };
  
  // Listeners for state changes
  const listeners = new Set();
  
  // Notify listeners of state changes
  function notifyListeners() {
    listeners.forEach(listener => listener(state));
  }
  
  /**
   * Get current state
   */
  function getState() {
    return state;
  }
  
  /**
   * Dispatch an action to update state
   */
  function dispatch(action) {
    if (!action || typeof action !== 'object' || !action.type) {
      console.warn('Invalid action:', action);
      return action;
    }
    
    const reducer = reducers[action.type];
    
    if (typeof reducer === 'function') {
      // Apply reducer to get new state
      const nextState = reducer(state, action.payload);
      
      // Update state and notify listeners
      if (nextState !== state) {
        state = nextState;
        notifyListeners();
      }
    } else {
      console.warn(`No reducer found for action type: ${action.type}`);
    }
    
    return action;
  }
  
  /**
   * Subscribe to state changes
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      console.warn('Expected listener to be a function');
      return () => {};
    }
    
    listeners.add(listener);
    
    // Return unsubscribe function
    return function unsubscribe() {
      listeners.delete(listener);
    };
  }
  
  /**
   * React hook to use the store state
   */
  function useStore() {
    const [storeState, setStoreState] = useState(state);
    
    useEffect(() => {
      // Subscribe to store updates
      const unsubscribe = subscribe((newState) => {
        setStoreState({ ...newState });
      });
      
      // Unsubscribe on cleanup
      return unsubscribe;
    }, []);
    
    return {
      state: storeState,
      dispatch
    };
  }
  
  // Initialize the store with default values
  dispatch({ type: '@@INIT' });
  
  return {
    getState,
    dispatch,
    subscribe,
    useStore
  };
}

export { createStore };