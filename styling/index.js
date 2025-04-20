// styling/index.js - Main entry point for the styling module

import { 
    TailwindProcessor, 
    tailwind, 
    withTailwind, 
    TailwindProvider,
    processPlatformStyles
  } from './tailwind.js';
  
  import {
    createCSSModule,
    classNames,
    addStyleToHead
  } from './css-modules.js';
  
  import {
    defaultTheme,
    ThemeProvider,
    useTheme,
    getThemeVariables,
    generateThemeCSS
  } from './theme.js';
  
  // Create React Native components with Tailwind support
  import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity,
    StyleSheet
  } from '../native/components.js';
  
  import { Platform } from '../native/platform.js';
  
  // Enhanced React Native components with Tailwind support
  const reactorNative = {
    View: withTailwind(View),
    Text: withTailwind(Text),
    Image: withTailwind(Image),
    TouchableOpacity: withTailwind(TouchableOpacity),
    Platform,
    StyleSheet
  };
  
  // React Native + Tailwind component wrapper
  function withReactorNative(Component) {
    return function ReactorNativeComponent(props) {
      const { className, style, ...rest } = props;
      const platform = Platform.OS;
      
      // Process Tailwind classes
      const tailwindStyles = tailwind.processClasses(className);
      
      // Process platform-specific styles
      const platformStyles = processPlatformStyles({
        ...tailwindStyles,
        ...style
      }, platform);
      
      return createElement(Component, {
        ...rest,
        style: platformStyles
      });
    };
  }
  
  // Export all styling functionality
  export {
    // Tailwind integration
    TailwindProcessor,
    tailwind,
    withTailwind,
    TailwindProvider,
    
    // CSS Modules
    createCSSModule,
    classNames,
    addStyleToHead,
    
    // Theming
    defaultTheme,
    ThemeProvider,
    useTheme,
    getThemeVariables,
    generateThemeCSS,
    
    // React Native integration
    reactorNative,
    withReactorNative
  };