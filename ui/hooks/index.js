// ui/hooks/index.js - UI utility hooks

import { useState, useEffect, useRef } from '../../core/hooks.js';

/**
 * Hook to track media queries
 * @param {string} query - Media query string
 * @returns {boolean} Whether the media query matches
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Skip for SSR
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    
    const listener = (event) => {
      setMatches(event.matches);
    };
    
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}

/**
 * Hook to track element dimensions
 * @param {React.RefObject} ref - Ref to the element to measure
 * @returns {Object} Element dimensions { width, height }
 */
function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  
  return size;
}

/**
 * Hook to detect clicks outside an element
 * @param {React.RefObject} ref - Ref to the element to detect clicks outside of
 * @param {Function} handler - Function to call when a click outside is detected
 */
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

/**
 * Hook to handle keyboard shortcuts
 * @param {Object} keyMap - Map of key combinations to handlers
 */
function useKeyboardShortcut(keyMap) {
  useEffect(() => {
    const handler = (event) => {
      const { key, ctrlKey, shiftKey, altKey, metaKey } = event;
      
      // Create a string representation of the key combination
      const keyCombo = [
        ctrlKey && 'Ctrl',
        shiftKey && 'Shift',
        altKey && 'Alt',
        metaKey && 'Meta',
        key
      ].filter(Boolean).join('+');
      
      if (keyMap[keyCombo]) {
        event.preventDefault();
        keyMap[keyCombo](event);
      }
    };
    
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [keyMap]);
}

/**
 * Hook to manage local storage state
 * @param {string} key - Local storage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {[*, Function]} State value and setter function
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
}

/**
 * Hook to manage debounced values
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} Debounced value
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

export {
  useMediaQuery,
  useElementSize,
  useOnClickOutside,
  useKeyboardShortcut,
  useLocalStorage,
  useDebounce
};