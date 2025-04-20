// styling/theme.js - Theming system

import { useState, useEffect, createContext, useContext } from '../core/hooks.js';
import { createElement } from '../core/vdom.js';

/**
 * Default theme configuration
 */
const defaultTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    light: '#f3f4f6',
    dark: '#1f2937'
  },
  fonts: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem'
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

/**
 * Theme context for providing theme values to components
 */
const ThemeContext = createContext({
  theme: defaultTheme,
  mode: 'light',
  setMode: () => {}
});

/**
 * Theme provider component
 */
function ThemeProvider({ theme = {}, defaultMode = 'light', children }) {
  const [mode, setMode] = useState(defaultMode);
  const mergedTheme = {
    ...defaultTheme,
    ...theme,
    colors: {
      ...defaultTheme.colors,
      ...theme.colors
    },
    fonts: {
      ...defaultTheme.fonts,
      ...theme.fonts
    }
  };
  
  // Update document with theme class when mode changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(mode);
    }
  }, [mode]);
  
  return createElement(
    ThemeContext.Provider,
    {
      value: {
        theme: mergedTheme,
        mode,
        setMode
      }
    },
    children
  );
}

/**
 * Hook to use theme values in components
 */
function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

/**
 * Get CSS variables from theme for CSS-in-JS or CSS Variables
 */
function getThemeVariables(theme = defaultTheme) {
  const variables = {};
  
  // Process colors
  Object.entries(theme.colors || {}).forEach(([key, value]) => {
    variables[`--color-${key}`] = value;
  });
  
  // Process fonts
  Object.entries(theme.fonts || {}).forEach(([key, value]) => {
    variables[`--font-${key}`] = value;
  });
  
  // Process spacing
  Object.entries(theme.spacing || {}).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value;
  });
  
  // Process border radius
  Object.entries(theme.borderRadius || {}).forEach(([key, value]) => {
    const varKey = key === 'DEFAULT' ? 'border-radius' : `border-radius-${key}`;
    variables[`--${varKey}`] = value;
  });
  
  return variables;
}

/**
 * Generate CSS from theme
 */
function generateThemeCSS(theme = defaultTheme) {
  const variables = getThemeVariables(theme);
  let css = '';
  
  // Root variables
  css += ':root {\n';
  Object.entries(variables).forEach(([key, value]) => {
    css += `  ${key}: ${value};\n`;
  });
  css += '}\n\n';
  
  // Dark mode variables
  if (theme.dark) {
    css += '.dark {\n';
    Object.entries(getThemeVariables(theme.dark)).forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
    css += '}\n';
  }
  
  return css;
}

export {
  defaultTheme,
  ThemeProvider,
  useTheme,
  getThemeVariables,
  generateThemeCSS
};