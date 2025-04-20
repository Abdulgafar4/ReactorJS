// core/renderer.js - DOM rendering logic

import { VNode } from './vdom.js';

/**
 * Creates a real DOM element from a Virtual DOM node
 */
function createDOMElement(vnode) {
  const { type, props, children } = vnode;
  
  // Handle text elements
  if (type === 'TEXT_ELEMENT') {
    return document.createTextNode(props.nodeValue);
  }
  
  // Handle regular DOM elements
  const dom = document.createElement(type);
  
  // Set properties and event listeners
  updateDOMProperties(dom, {}, props);
  
  // Recursively create and append children
  children.forEach(child => {
    const childDom = createDOMElement(child);
    dom.appendChild(childDom);
  });
  
  return dom;
}

/**
 * Updates the properties of a DOM element
 */
function updateDOMProperties(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps).forEach(name => {
    if (name.startsWith('on') && (!(name in nextProps) || prevProps[name] !== nextProps[name])) {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    }
  });
  
  // Remove old properties
  Object.keys(prevProps).forEach(name => {
    if (!(name in nextProps) && name !== 'children') {
      dom[name] = '';
    }
  });
  
  // Set new or changed properties
  Object.keys(nextProps).forEach(name => {
    if (name !== 'children' && name !== 'key' && prevProps[name] !== nextProps[name]) {
      if (name.startsWith('on') && typeof nextProps[name] === 'function') {
        // Handle event listeners
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
      } else if (name === 'style' && typeof nextProps[name] === 'object') {
        // Handle style objects
        Object.assign(dom.style, nextProps[name]);
      } else if (name === 'className') {
        // Handle className -> class conversion
        dom.setAttribute('class', nextProps[name]);
      } else if (typeof nextProps[name] !== 'object' && typeof nextProps[name] !== 'function') {
        // Handle normal attributes
        dom[name] = nextProps[name];
      }
    }
  });
}

/**
 * Updates the DOM based on Virtual DOM changes (diffing algorithm)
 */
function updateDOM(parentDOM, oldVNode, newVNode, index = 0) {
  if (!oldVNode && newVNode) {
    // Create new node
    parentDOM.appendChild(createDOMElement(newVNode));
  } else if (oldVNode && !newVNode) {
    // Remove node
    parentDOM.removeChild(parentDOM.childNodes[index]);
  } else if (oldVNode && newVNode && oldVNode.type !== newVNode.type) {
    // Replace node
    parentDOM.replaceChild(createDOMElement(newVNode), parentDOM.childNodes[index]);
  } else if (oldVNode && newVNode && oldVNode.type === newVNode.type) {
    if (oldVNode.type === 'TEXT_ELEMENT') {
      // Update text content if needed
      if (oldVNode.props.nodeValue !== newVNode.props.nodeValue) {
        parentDOM.childNodes[index].nodeValue = newVNode.props.nodeValue;
      }
    } else {
      // Update properties
      updateDOMProperties(
        parentDOM.childNodes[index],
        oldVNode.props,
        newVNode.props
      );
      
      // Recursively update children
      const oldChildren = oldVNode.children;
      const newChildren = newVNode.children;
      
      // Optimize child reconciliation with keys
      if (oldChildren.some(child => child.key != null) && newChildren.some(child => child.key != null)) {
        reconcileChildren(parentDOM.childNodes[index], oldChildren, newChildren);
      } else {
        // Simple reconciliation for non-keyed children
        const maxLength = Math.max(oldChildren.length, newChildren.length);
        for (let i = 0; i < maxLength; i++) {
          updateDOM(
            parentDOM.childNodes[index],
            oldChildren[i],
            newChildren[i],
            i
          );
        }
      }
    }
  }
}

/**
 * Reconciles children with keys (more efficient diffing)
 */
function reconcileChildren(parentDOM, oldChildren, newChildren) {
  // Create maps for faster lookup
  const oldKeyedChildren = {};
  const newKeyedChildren = {};
  
  // Extract keyed children
  oldChildren.forEach((child, index) => {
    if (child.key != null) {
      oldKeyedChildren[child.key] = { vnode: child, index };
    }
  });
  
  let lastIndex = 0;
  
  // Process new children
  newChildren.forEach((newChild, newIndex) => {
    if (newChild.key == null) {
      // For children without keys, use index-based algorithm
      updateDOM(parentDOM, oldChildren[newIndex], newChild, newIndex);
      return;
    }
    
    newKeyedChildren[newChild.key] = { vnode: newChild, index: newIndex };
    
    // Find corresponding old child
    const oldChild = oldKeyedChildren[newChild.key];
    
    if (oldChild) {
      // Update existing node
      updateDOM(parentDOM, oldChild.vnode, newChild, oldChild.index);
      
      // Check if we need to move the DOM node
      if (oldChild.index < lastIndex) {
        // Move DOM node
        parentDOM.insertBefore(
          parentDOM.childNodes[oldChild.index],
          parentDOM.childNodes[lastIndex]
        );
      } else {
        lastIndex = oldChild.index;
      }
    } else {
      // Create new node
      const dom = createDOMElement(newChild);
      
      // Find insertion point
      if (newIndex >= parentDOM.childNodes.length) {
        parentDOM.appendChild(dom);
      } else {
        parentDOM.insertBefore(dom, parentDOM.childNodes[newIndex]);
      }
    }
  });
  
  // Remove old nodes that are no longer needed
  Object.keys(oldKeyedChildren).forEach(key => {
    if (!(key in newKeyedChildren)) {
      const { index } = oldKeyedChildren[key];
      parentDOM.removeChild(parentDOM.childNodes[index]);
    }
  });
}

/**
 * Main render function - entry point for rendering to the DOM
 */
function render(vnode, container) {
  // If container has previous content, do diffing update
  if (container._currentVNode) {
    updateDOM(container, container._currentVNode, vnode);
  } else {
    // First render, create from scratch
    container.innerHTML = '';
    container.appendChild(createDOMElement(vnode));
  }
  
  // Store the current vnode for future diffing
  container._currentVNode = vnode;
}

export { 
  createDOMElement, 
  updateDOMProperties, 
  updateDOM, 
  reconcileChildren, 
  render 
};