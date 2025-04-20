// core/vdom.js - Virtual DOM implementation

/**
 * Virtual DOM Node representation
 */
class VNode {
    constructor(type, props, key, children) {
      this.type = type;
      this.props = props || {};
      this.key = key;
      this.children = children || [];
    }
  }
  
  /**
   * Creates a Virtual DOM element (JSX compatible)
   */
  function createElement(type, props = {}, ...children) {
    const key = props?.key;
    delete props?.key; // Remove key from props
    
    children = children.flat().map(child => 
      typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean'
        ? createTextElement(child)
        : child
    );
    
    return new VNode(type, props, key, children.filter(child => child != null));
  }
  
  /**
   * Creates a text element in the Virtual DOM
   */
  function createTextElement(text) {
    return new VNode('TEXT_ELEMENT', { nodeValue: String(text) }, null, []);
  }
  
  export { VNode, createElement, createTextElement };