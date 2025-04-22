// router/link.js - Navigation component

import { createElement } from '../core/vdom.js';
import { Component } from '../core/component.js';

/**
 * Link component for client-side navigation
 * Similar to Next.js Link component
 */
class Link extends Component {
  /**
   * Handle click events on the link
   */
  handleClick = (e) => {
    const { href, onClick, target } = this.props;
    
    // Let the browser handle external links or ones with targets
    if (!href || !href.startsWith('/') || target) {
      return;
    }
    
    e.preventDefault();
    
    if (onClick) {
      onClick(e);
    }
    
    if (!e.defaultPrevented) {
      // Get router instance
      const router = this.props.router || (window.__CLYRA_ROUTER__);
      
      if (router) {
        router.navigate(href, {
          replace: this.props.replace
        });
      } else {
        // Fallback if router is not available
        window.location.href = href;
      }
    }
  };
  
  /**
   * Render the link as an anchor element
   */
  render() {
    const { href, children, className, style, replace, router, ...rest } = this.props;
    
    return createElement('a', {
      href,
      onClick: this.handleClick,
      className,
      style,
      ...rest
    }, children);
  }
}

export { Link };