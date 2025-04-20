// styling/css-modules.js - CSS modules support

/**
 * CSS Modules support (simplified version)
 * In a real implementation, this would be handled by a bundler like webpack
 */

/**
 * Simulates CSS modules functionality by scoping class names
 * @param {Object} styles - CSS module styles object
 * @param {string} componentName - Component name for scoping
 * @returns {Object} Scoped CSS module styles
 */
function createCSSModule(styles, componentName) {
    const scopedStyles = {};
    const hash = generateScopeHash(componentName);
    
    Object.entries(styles).forEach(([className, value]) => {
      scopedStyles[className] = `${className}__${hash}`;
    });
    
    return scopedStyles;
  }
  
  /**
   * Generates a hash for CSS class scoping
   * @param {string} str - String to hash
   * @returns {string} Hash string
   */
  function generateScopeHash(str) {
    let hash = 0;
    
    if (str.length === 0) return hash.toString(36);
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36).substring(0, 5);
  }
  
  /**
   * Allows composing multiple CSS module classes together
   * @param {...string} classNames - CSS module class names
   * @returns {string} Combined class names
   */
  function classNames(...args) {
    return args
      .filter(Boolean)
      .join(' ');
  }
  
  /**
   * Adds style element to document head during SSR
   * @param {string} id - Style element ID
   * @param {string} css - CSS content
   */
  function addStyleToHead(id, css) {
    if (typeof document === 'undefined') return;
    
    let styleElement = document.getElementById(id);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = id;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = css;
  }
  
  export {
    createCSSModule,
    generateScopeHash,
    classNames,
    addStyleToHead
  };