// native/platform.js - Platform detection

/**
 * Platform detection utility
 * Used to determine the current platform (web, ios, android)
 */
const Platform = {
    /**
     * Current operating system
     */
    OS: typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/.test(navigator.userAgent)
      ? /Android/.test(navigator.userAgent) ? 'android' : 'ios'
      : 'web',
    
    /**
     * Selects a value based on the current platform
     * @param {Object} obj - Object with platform-specific values
     * @returns {*} The value for the current platform or default
     */
    select(obj) {
      return obj[this.OS] || obj.default;
    }
  };
  
  export { Platform };