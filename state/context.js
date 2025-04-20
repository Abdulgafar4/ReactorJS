// state/context.js - Component context system

import { createContext, useContext } from '../core/hooks.js';

/**
 * Creates a context with enhanced functionality
 * @param {any} defaultValue - Default context value
 * @returns {Object} Enhanced context object
 */
function createEnhancedContext(defaultValue) {
  // Create standard context
  const Context = createContext(defaultValue);
  
  /**
   * Provider component with state management capabilities
   */
  function Provider({ value, children }) {
    return {
      type: Context.Provider,
      props: { value, children }
    };
  }
  
  /**
   * Consumer component with simplified API
   */
  function Consumer({ children }) {
    return {
      type: Context.Consumer,
      props: { children }
    };
  }
  
  /**
   * Hook to use this context with error handling
   */
  function useEnhancedContext() {
    const value = useContext(Context);
    
    if (value === undefined) {
      throw new Error('useContext must be used within a Provider');
    }
    
    return value;
  }
  
  return {
    Provider,
    Consumer,
    useContext: useEnhancedContext
  };
}

export { createEnhancedContext };