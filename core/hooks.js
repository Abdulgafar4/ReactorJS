// core/hooks.js - React-like hooks

// Global state for the current component rendering with hooks
const currentComponent = { current: null };
let currentHookIndex = 0;

/**
 * Prepares the hooks system for a new component render
 */
function prepareHooksForRender(component) {
  currentComponent.current = component;
  currentHookIndex = 0;
}

/**
 * useState hook for managing state in functional components
 */
function useState(initialState) {
  const component = currentComponent.current;
  const hookIndex = currentHookIndex++;
  
  // Initialize hook state
  if (!component._hooks) component._hooks = [];
  if (!component._hooks[hookIndex]) {
    component._hooks[hookIndex] = {
      state: typeof initialState === 'function' ? initialState() : initialState
    };
  }
  
  const hook = component._hooks[hookIndex];
  
  // State setter function
  const setState = (newState) => {
    const nextState = typeof newState === 'function' 
      ? newState(hook.state) 
      : newState;
      
    if (nextState !== hook.state) {
      hook.state = nextState;
      component._scheduleUpdate();
    }
  };
  
  return [hook.state, setState];
}

/**
 * useEffect hook for side effects in functional components
 */
function useEffect(effect, deps) {
  const component = currentComponent.current;
  const hookIndex = currentHookIndex++;
  
  // Initialize hook state
  if (!component._hooks) component._hooks = [];
  if (!component._hooks[hookIndex]) {
    component._hooks[hookIndex] = { deps: null, cleanup: null };
  }
  
  const hook = component._hooks[hookIndex];
  
  // Check if deps changed
  const depsChanged = !hook.deps || !deps || 
    deps.some((dep, i) => dep !== hook.deps[i]);
  
  if (depsChanged) {
    // Clean up previous effect
    if (typeof hook.cleanup === 'function') {
      hook.cleanup();
    }
    
    // Schedule effect execution
    Promise.resolve().then(() => {
      hook.deps = deps;
      hook.cleanup = effect();
    });
  }
}

/**
 * useRef hook for mutable references in functional components
 */
function useRef(initialValue) {
  const component = currentComponent.current;
  const hookIndex = currentHookIndex++;
  
  // Initialize hook state
  if (!component._hooks) component._hooks = [];
  if (!component._hooks[hookIndex]) {
    component._hooks[hookIndex] = { current: initialValue };
  }
  
  return component._hooks[hookIndex];
}

/**
 * useMemo hook for memoized values in functional components
 */
function useMemo(factory, deps) {
  const component = currentComponent.current;
  const hookIndex = currentHookIndex++;
  
  // Initialize hook state
  if (!component._hooks) component._hooks = [];
  if (!component._hooks[hookIndex]) {
    component._hooks[hookIndex] = { 
      deps: null, 
      value: factory() 
    };
  }
  
  const hook = component._hooks[hookIndex];
  
  // Check if deps changed
  const depsChanged = !hook.deps || !deps || 
    deps.some((dep, i) => dep !== hook.deps[i]);
  
  if (depsChanged) {
    hook.deps = deps;
    hook.value = factory();
  }
  
  return hook.value;
}

/**
 * useCallback hook for memoized callbacks in functional components
 */
function useCallback(callback, deps) {
  return useMemo(() => callback, deps);
}

/**
 * useContext hook for consuming context in functional components
 */
function useContext(context) {
  // Implementation would search up the component tree
  // for the nearest provider
  return context.defaultValue;
}

/**
 * Creates a context for sharing values without prop drilling
 */
function createContext(defaultValue) {
  const context = {
    Provider: function({ value, children }) {
      return {
        type: 'CONTEXT_PROVIDER',
        props: { value, contextId: context.id },
        children
      };
    },
    Consumer: function({ children }) {
      return {
        type: 'CONTEXT_CONSUMER',
        props: { contextId: context.id },
        children
      };
    },
    id: Symbol('context'),
    defaultValue
  };
  
  return context;
}

export {
  prepareHooksForRender,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  createContext
};