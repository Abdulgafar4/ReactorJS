// core/reactivity.js - Vue-like reactivity

// Current effect being tracked
let currentEffect = null;

/**
 * Creates a reactive state object that tracks changes
 */
function reactive(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  const dependencies = new Map();
  const notify = (key) => {
    if (dependencies.has(key)) {
      dependencies.get(key).forEach(sub => sub());
    }
  };
  
  return new Proxy(obj, {
    get(target, key) {
      // Track dependencies
      if (currentEffect) {
        if (!dependencies.has(key)) {
          dependencies.set(key, new Set());
        }
        dependencies.get(key).add(currentEffect);
      }
      
      const value = target[key];
      return typeof value === 'object' && value !== null ? reactive(value) : value;
    },
    set(target, key, value) {
      const result = Reflect.set(target, key, value);
      notify(key);
      return result;
    }
  });
}

/**
 * Watches for changes in reactive state and runs the effect function
 */
function watchEffect(effect) {
  const execute = () => {
    currentEffect = execute;
    try {
      effect();
    } finally {
      currentEffect = null;
    }
  };
  
  execute();
  
  return () => {
    // Cleanup function
    currentEffect = null;
  };
}

/**
 * Creates a computed value that updates when its dependencies change
 */
function computed(getter) {
  const result = reactive({ value: undefined });
  watchEffect(() => {
    result.value = getter();
  });
  return result;
}

export { reactive, watchEffect, computed };