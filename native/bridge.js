// native/bridge.js - React Native bridge

import { View, Text, Image, TouchableOpacity } from './components.js';

/**
 * Native component registry
 * Registers and provides access to native components
 */
const NativeRegistry = {
  components: {},
  
  /**
   * Register a native component
   * @param {string} name - Component name
   * @param {Function} component - Component implementation
   * @returns {Function} The registered component
   */
  register(name, component) {
    this.components[name] = component;
    return component;
  },
  
  /**
   * Get a native component by name
   * @param {string} name - Component name
   * @returns {Function|null} The component or null if not found
   */
  get(name) {
    return this.components[name] || null;
  }
};

// Register core native components
NativeRegistry.register('View', View);
NativeRegistry.register('Text', Text);
NativeRegistry.register('Image', Image);
NativeRegistry.register('TouchableOpacity', TouchableOpacity);

/**
 * AppRegistry - mimics React Native's AppRegistry
 * Used to register and run applications
 */
const AppRegistry = {
  applications: {},
  
  /**
   * Register a component as the running application
   * @param {string} appKey - Application key
   * @param {Function} componentProvider - Function that returns the root component
   */
  registerComponent(appKey, componentProvider) {
    this.applications[appKey] = componentProvider;
    return componentProvider;
  },
  
  /**
   * Get a registered application by key
   * @param {string} appKey - Application key
   * @returns {Function|null} The application component provider or null
   */
  getApplication(appKey) {
    return this.applications[appKey] || null;
  }
};

export { NativeRegistry, AppRegistry };