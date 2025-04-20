// styling/tailwind.js - Tailwind CSS integration

import { createElement } from '../core/vdom.js';
import { useEffect } from '../core/hooks.js';

/**
 * Tailwind processor (simplified version)
 * In a real implementation, this would use PostCSS with Tailwind plugins
 */
class TailwindProcessor {
  constructor(config = {}) {
    this.config = {
      theme: {
        colors: {
          primary: '#3b82f6',
          secondary: '#6b7280',
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
          light: '#f3f4f6',
          dark: '#1f2937',
          ...config.theme?.colors
        },
        spacing: {
          px: '1px',
          0: '0px',
          0.5: '0.125rem',
          1: '0.25rem',
          1.5: '0.375rem',
          2: '0.5rem',
          2.5: '0.625rem',
          3: '0.75rem',
          3.5: '0.875rem',
          4: '1rem',
          5: '1.25rem',
          6: '1.5rem',
          8: '2rem',
          10: '2.5rem',
          12: '3rem',
          16: '4rem',
          20: '5rem',
          24: '6rem',
          32: '8rem',
          40: '10rem',
          48: '12rem',
          56: '14rem',
          64: '16rem',
          ...config.theme?.spacing
        },
        borderRadius: {
          none: '0',
          sm: '0.125rem',
          DEFAULT: '0.25rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          full: '9999px',
          ...config.theme?.borderRadius
        },
        fontFamily: {
          sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
          serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
          mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
          ...config.theme?.fontFamily
        },
        fontSize: {
          xs: ['0.75rem', { lineHeight: '1rem' }],
          sm: ['0.875rem', { lineHeight: '1.25rem' }],
          base: ['1rem', { lineHeight: '1.5rem' }],
          lg: ['1.125rem', { lineHeight: '1.75rem' }],
          xl: ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
          ...config.theme?.fontSize
        },
        ...config.theme
      },
      variants: {
        extend: {
          ...config.variants?.extend
        },
        ...config.variants
      },
      plugins: [
        ...(config.plugins || [])
      ]
    };
    
    // Pre-generate common utility classes
    this.utilityClasses = this.generateUtilityClasses();
  }
  
  /**
   * Generate basic utility classes based on config
   */
  generateUtilityClasses() {
    const classes = {};
    const { theme } = this.config;
    
    // Colors
    Object.entries(theme.colors).forEach(([colorName, colorValue]) => {
      // Text colors
      classes[`text-${colorName}`] = { color: colorValue };
      
      // Background colors
      classes[`bg-${colorName}`] = { backgroundColor: colorValue };
      
      // Border colors
      classes[`border-${colorName}`] = { borderColor: colorValue };
    });
    
    // Spacing (margin, padding)
    Object.entries(theme.spacing).forEach(([size, value]) => {
      // Margin
      classes[`m-${size}`] = { margin: value };
      classes[`mt-${size}`] = { marginTop: value };
      classes[`mr-${size}`] = { marginRight: value };
      classes[`mb-${size}`] = { marginBottom: value };
      classes[`ml-${size}`] = { marginLeft: value };
      classes[`mx-${size}`] = { marginLeft: value, marginRight: value };
      classes[`my-${size}`] = { marginTop: value, marginBottom: value };
      
      // Padding
      classes[`p-${size}`] = { padding: value };
      classes[`pt-${size}`] = { paddingTop: value };
      classes[`pr-${size}`] = { paddingRight: value };
      classes[`pb-${size}`] = { paddingBottom: value };
      classes[`pl-${size}`] = { paddingLeft: value };
      classes[`px-${size}`] = { paddingLeft: value, paddingRight: value };
      classes[`py-${size}`] = { paddingTop: value, paddingBottom: value };
      
      // Width and height
      classes[`w-${size}`] = { width: value };
      classes[`h-${size}`] = { height: value };
      
      // Min/max width/height
      classes[`min-w-${size}`] = { minWidth: value };
      classes[`min-h-${size}`] = { minHeight: value };
      classes[`max-w-${size}`] = { maxWidth: value };
      classes[`max-h-${size}`] = { maxHeight: value };
    });
    
    // Border radius
    Object.entries(theme.borderRadius).forEach(([size, value]) => {
      const key = size === 'DEFAULT' ? 'rounded' : `rounded-${size}`;
      classes[key] = { borderRadius: value };
    });
    
    // Font families
    Object.entries(theme.fontFamily).forEach(([family, stack]) => {
      classes[`font-${family}`] = { fontFamily: stack.join(', ') };
    });
    
    // Font sizes
    Object.entries(theme.fontSize).forEach(([size, config]) => {
      const [fontSize, { lineHeight }] = Array.isArray(config) ? config : [config, { lineHeight: '1.5' }];
      classes[`text-${size}`] = { fontSize, lineHeight };
    });
    
    // Flexbox
    classes['flex'] = { display: 'flex' };
    classes['inline-flex'] = { display: 'inline-flex' };
    classes['flex-row'] = { flexDirection: 'row' };
    classes['flex-col'] = { flexDirection: 'column' };
    classes['flex-wrap'] = { flexWrap: 'wrap' };
    classes['flex-nowrap'] = { flexWrap: 'nowrap' };
    classes['items-start'] = { alignItems: 'flex-start' };
    classes['items-center'] = { alignItems: 'center' };
    classes['items-end'] = { alignItems: 'flex-end' };
    classes['justify-start'] = { justifyContent: 'flex-start' };
    classes['justify-center'] = { justifyContent: 'center' };
    classes['justify-end'] = { justifyContent: 'flex-end' };
    classes['justify-between'] = { justifyContent: 'space-between' };
    classes['justify-around'] = { justifyContent: 'space-around' };
    
    // Grid
    classes['grid'] = { display: 'grid' };
    classes['grid-cols-1'] = { gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' };
    classes['grid-cols-2'] = { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' };
    classes['grid-cols-3'] = { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' };
    classes['grid-cols-4'] = { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' };
    classes['grid-cols-6'] = { gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' };
    classes['grid-cols-12'] = { gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' };
    classes['gap-0'] = { gap: '0' };
    classes['gap-1'] = { gap: '0.25rem' };
    classes['gap-2'] = { gap: '0.5rem' };
    classes['gap-4'] = { gap: '1rem' };
    classes['gap-6'] = { gap: '1.5rem' };
    classes['gap-8'] = { gap: '2rem' };
    
    // Common utilities
    classes['hidden'] = { display: 'none' };
    classes['block'] = { display: 'block' };
    classes['inline'] = { display: 'inline' };
    classes['inline-block'] = { display: 'inline-block' };
    classes['relative'] = { position: 'relative' };
    classes['absolute'] = { position: 'absolute' };
    classes['fixed'] = { position: 'fixed' };
    classes['sticky'] = { position: 'sticky' };
    
    // Position
    classes['top-0'] = { top: '0' };
    classes['right-0'] = { right: '0' };
    classes['bottom-0'] = { bottom: '0' };
    classes['left-0'] = { left: '0' };
    
    // Text alignment
    classes['text-left'] = { textAlign: 'left' };
    classes['text-center'] = { textAlign: 'center' };
    classes['text-right'] = { textAlign: 'right' };
    
    // Text decoration
    classes['underline'] = { textDecoration: 'underline' };
    classes['line-through'] = { textDecoration: 'line-through' };
    classes['no-underline'] = { textDecoration: 'none' };
    
    // Font weight
    classes['font-thin'] = { fontWeight: '100' };
    classes['font-extralight'] = { fontWeight: '200' };
    classes['font-light'] = { fontWeight: '300' };
    classes['font-normal'] = { fontWeight: '400' };
    classes['font-medium'] = { fontWeight: '500' };
    classes['font-semibold'] = { fontWeight: '600' };
    classes['font-bold'] = { fontWeight: '700' };
    classes['font-extrabold'] = { fontWeight: '800' };
    classes['font-black'] = { fontWeight: '900' };
    
    return classes;
  }
  
  /**
   * Process Tailwind classes to generate CSS styles
   */
  processClasses(classString) {
    if (!classString) return {};
    
    // Parse class names
    const classNames = classString.split(/\s+/).filter(Boolean);
    
    // Accumulate styles
    const styles = {};
    
    classNames.forEach(className => {
      if (this.utilityClasses[className]) {
        Object.assign(styles, this.utilityClasses[className]);
      }
    });
    
    return styles;
  }
  
  /**
   * Generate stylesheet for server-side rendering
   */
  generateStylesheet() {
    let stylesheet = '';
    
    Object.entries(this.utilityClasses).forEach(([className, styles]) => {
      stylesheet += `.${className} {\n`;
      Object.entries(styles).forEach(([property, value]) => {
        stylesheet += `  ${kebabCase(property)}: ${value};\n`;
      });
      stylesheet += '}\n';
    });
    
    return stylesheet;
  }
}

/**
 * Helper to convert camelCase to kebab-case
 */
function kebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Create global Tailwind instance
const tailwind = new TailwindProcessor();

/**
 * Tailwind component wrapper
 * Processes Tailwind classes and converts them to inline styles
 */
function withTailwind(Component) {
  return function TailwindComponent(props) {
    const { className, style, ...rest } = props;
    
    // Process Tailwind classes
    const tailwindStyles = tailwind.processClasses(className);
    
    // Combine with inline styles
    const combinedStyles = {
      ...tailwindStyles,
      ...style
    };
    
    return createElement(Component, {
      ...rest,
      style: combinedStyles
    });
  };
}

/**
 * Component to load Tailwind CSS
 * Only used in development - in production, styles would be pre-compiled
 */
function TailwindProvider({ config, children }) {
  useEffect(() => {
    // In a real implementation, this would inject a stylesheet
    // or ensure the Tailwind CSS is loaded
    console.log('Tailwind CSS loaded');
  }, []);
  
  return children;
}

// Handle platform-specific styles
function processPlatformStyles(styles, platform = 'web') {
  // Filter platform-specific styles
  const platformStyles = {};
  
  Object.entries(styles).forEach(([key, value]) => {
    // Handle platform specific keys like marginTop_ios
    const [baseProp, platformKey] = key.split('_');
    
    if (!platformKey || platformKey === platform) {
      platformStyles[baseProp] = value;
    }
  });
  
  return platformStyles;
}

export {
  TailwindProcessor,
  tailwind,
  withTailwind,
  TailwindProvider,
  kebabCase,
  processPlatformStyles
};