// core/component.js - Component base classes

import { createDOMElement, updateDOM } from './renderer.js';
import { prepareHooksForRender } from './hooks.js';

/**
 * Base Component class (React-style)
 */
class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this._prevVNode = null;
    this._domNode = null;
    this._isMounted = false;
    this._pendingState = null;
    this._renderScheduled = false;
  }
  
  /**
   * Updates component state and schedules a re-render
   */
  setState(partialState) {
    this._pendingState = {
      ...this._pendingState || this.state,
      ...(typeof partialState === 'function' 
          ? partialState(this._pendingState || this.state, this.props) 
          : partialState)
    };
    
    this._scheduleUpdate();
  }
  
  /**
   * Schedules an async update to avoid blocking the main thread
   */
  _scheduleUpdate() {
    if (!this._renderScheduled) {
      this._renderScheduled = true;
      
      Promise.resolve().then(() => {
        this._renderScheduled = false;
        if (this._pendingState !== null) {
          this._updateComponent();
        }
      });
    }
  }
  
  /**
   * Updates the component with new state/props
   */
  _updateComponent() {
    if (!this._isMounted) return;
    
    const prevState = this.state;
    const nextState = this._pendingState;
    
    this.state = nextState;
    this._pendingState = null;
    
    const prevProps = this.props;
    
    // Call lifecycle method
    if (this.shouldComponentUpdate?.(this.props, nextState, prevState) === false) {
      return;
    }
    
    // Call lifecycle method
    this.componentWillUpdate?.(this.props, nextState);
    
    const prevVNode = this._prevVNode;
    const nextVNode = this.render();
    this._prevVNode = nextVNode;
    
    // Update DOM
    const parentDOM = this._domNode.parentNode;
    updateDOM(parentDOM, prevVNode, nextVNode, 
      Array.from(parentDOM.childNodes).indexOf(this._domNode));
    
    // Update reference to actual DOM node
    this._domNode = parentDOM.childNodes[
      Array.from(parentDOM.childNodes).indexOf(this._domNode)
    ];
    
    // Call lifecycle method
    this.componentDidUpdate?.(prevProps, prevState);
  }
  
  // Lifecycle methods (to be overridden by subclasses)
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {}
  componentWillUnmount() {}
  shouldComponentUpdate(nextProps, nextState) { return true; }
  componentWillUpdate(nextProps, nextState) {}
  
  /**
   * Renders the component (must be implemented by subclasses)
   */
  render() {
    throw new Error('Component subclass must implement render()');
  }
  
  /**
   * Mounts the component to a DOM container
   */
  mount(container) {
    const vnode = this.render();
    this._prevVNode = vnode;
    
    // First render
    container.innerHTML = '';
    this._domNode = createDOMElement(vnode);
    container.appendChild(this._domNode);
    
    this._isMounted = true;
    this.componentDidMount();
    
    return this._domNode;
  }
}

/**
 * Creates a component instance from a component class or function
 */
function createComponent(ComponentClass, props) {
  // Handle functional components
  if (typeof ComponentClass === 'function' && 
      !(ComponentClass.prototype instanceof Component)) {
    return {
      render: () => ComponentClass(props),
      mount: (container) => {
        const vnode = ComponentClass(props);
        const dom = createDOMElement(vnode);
        container.appendChild(dom);
        return dom;
      }
    };
  }
  
  // Handle class components
  return new ComponentClass(props);
}

/**
 * Wrapper for functional components with hooks support
 */
function FunctionalComponent(props) {
  const componentInstance = {
    props,
    _hooks: [],
    _scheduleUpdate: function() {
      if (this._container) {
        const vnode = this.render();
        updateDOM(this._container, this._prevVNode, vnode);
        this._prevVNode = vnode;
      }
    },
    render: function() {
      prepareHooksForRender(this);
      return props.component(props);
    },
    mount: function(container) {
      this._container = container;
      const vnode = this.render();
      this._prevVNode = vnode;
      const dom = createDOMElement(vnode);
      container.appendChild(dom);
      return dom;
    }
  };
  
  return componentInstance;
}

export { Component, createComponent, FunctionalComponent };