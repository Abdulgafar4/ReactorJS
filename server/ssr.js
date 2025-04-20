// server/ssr.js - Server-side rendering implementation

import { createElement } from '../core/vdom.js';
import { Component } from '../core/component.js';
import { FileRouter } from '../router/file-router.js';

/**
 * Convert components to HTML string
 */
function renderToString(element) {
  // Handle null or undefined
  if (element == null) {
    return '';
  }
  
  // Handle text elements
  if (typeof element === 'string' || typeof element === 'number' || typeof element === 'boolean') {
    return escapeHtml(String(element));
  }
  
  // Handle arrays
  if (Array.isArray(element)) {
    return element.map(renderToString).join('');
  }
  
  // Handle component types
  if (typeof element.type === 'function') {
    const Component = element.type;
    
    // Handle functional components
    if (!(Component.prototype instanceof Component)) {
      const result = Component(element.props);
      return renderToString(result);
    }
    
    // Handle class components
    const instance = new Component(element.props);
    const renderedElement = instance.render();
    return renderToString(renderedElement);
  }
  
  // Handle special types
  if (element.type === 'TEXT_ELEMENT') {
    return escapeHtml(element.props.nodeValue);
  }
  
  // Handle regular DOM elements
  const { type, props } = element;
  let html = `<${type}`;
  
  // Add attributes
  for (const [name, value] of Object.entries(props || {})) {
    if (name === 'children' || name === 'key') continue;
    if (name === 'className') html += ` class="${escapeHtml(value)}"`;
    else if (name === 'style' && typeof value === 'object') {
      const styleStr = Object.entries(value)
        .map(([k, v]) => `${kebabCase(k)}:${v}`)
        .join(';');
      html += ` style="${escapeHtml(styleStr)}"`;
    } else if (name.startsWith('on') || typeof value === 'function') {
      // Skip event handlers and functions
      continue;
    } else if (typeof value !== 'object') {
      html += ` ${name}="${escapeHtml(value)}"`;
    }
  }
  
  // Self-closing tags
  const voidElements = ['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
  if (voidElements.includes(type)) {
    return `${html} />`;
  }
  
  html += '>';
  
  // Add children
  if (props.children) {
    if (Array.isArray(props.children)) {
      for (const child of props.children) {
        html += renderToString(child);
      }
    } else {
      html += renderToString(props.children);
    }
  }
  
  // Close tag
  html += `</${type}>`;
  return html;
}

/**
 * Helper to escape HTML special characters
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Convert camelCase to kebab-case for CSS properties
 */
function kebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generate full HTML document
 */
function renderToDocument(element, options = {}) {
  const html = renderToString(element);
  const { title = 'ReactorJS App', styles = '', scripts = '', head = '' } = options;
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${head}
  <style>
    /* Tailwind CSS reset and base styles would go here */
    ${styles}
  </style>
</head>
<body>
  <div id="app">${html}</div>
  
  <script type="text/javascript">
    window.__REACTORJS_INITIAL_DATA__ = ${JSON.stringify(options.initialData || {})};
  </script>
  
  ${scripts}
</body>
</html>`;
}

/**
 * Server-side entry point for creating an application
 */
function createServerApp(options = {}) {
  const router = new FileRouter(options);
  
  // Register pages and layouts from config
  if (options.pages) {
    for (const [path, component] of Object.entries(options.pages)) {
      router.registerPage(path, component);
    }
  }
  
  if (options.layouts) {
    for (const [path, component] of Object.entries(options.layouts)) {
      router.registerLayout(path, component);
    }
  }
  
  if (options.notFound) {
    router.setNotFoundPage(options.notFound);
  }
  
  /**
   * Render a specific path to HTML
   */
  async function renderPath(path) {
    const result = router.findRoute(path);
    const { route, params, query, notFound } = result;
    const layouts = router.findLayouts(path);
    
    let pageProps = {};
    
    // Get initial props if available
    if (route.component.getInitialProps) {
      try {
        pageProps = await route.component.getInitialProps({
          params,
          query,
          router
        });
      } catch (error) {
        console.error('Error rendering path:', error);
        pageProps = { error: error.message };
      }
    }
    
    // Create page element
    let element = createElement(route.component, {
      params,
      query,
      router,
      ...pageProps
    });
    
    // Wrap in layouts
    for (let i = layouts.length - 1; i >= 0; i--) {
      const Layout = layouts[i];
      element = createElement(Layout, {
        params,
        query,
        router
      }, element);
    }
    
    const html = renderToDocument(element, {
      title: options.title || 'ReactorJS App',
      styles: options.styles || '',
      scripts: options.scripts || '',
      head: options.head || '',
      initialData: {
        path,
        params,
        query,
        pageProps,
        notFound
      }
    });
    
    return {
      html,
      statusCode: notFound ? 404 : 200,
      pageProps
    };
  }
  
  return {
    router,
    renderPath
  };
}

/**
 * Client-side hydration
 * Reuses server-rendered HTML and attaches event listeners
 */
function hydrate(options = {}) {
  const container = options.container || document.getElementById('app');
  const initialData = window.__REACTORJS_INITIAL_DATA__ || {};
  
  const router = new FileRouter({
    ...options,
    initialPath: initialData.path
  });
  
  // Register pages and layouts
  if (options.pages) {
    for (const [path, component] of Object.entries(options.pages)) {
      router.registerPage(path, component);
    }
  }
  
  if (options.layouts) {
    for (const [path, component] of Object.entries(options.layouts)) {
      router.registerLayout(path, component);
    }
  }
  
  if (options.notFound) {
    router.setNotFoundPage(options.notFound);
  }
  
  // Make router available globally
  window.__REACTORJS_ROUTER__ = router;
  
  // Mount the router
  router.mount(container);
  
  return router;
}

export {
  renderToString,
  renderToDocument,
  createServerApp,
  hydrate,
  escapeHtml,
  kebabCase
};