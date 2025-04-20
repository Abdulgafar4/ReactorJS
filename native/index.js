// native/index.js - Main entry point for the native module

import { Platform } from './platform.js';
import { View, Text, Image, TouchableOpacity, StyleSheet } from './components.js';
import { NativeRegistry, AppRegistry } from './bridge.js';

// Export all native functionality
export {
  // Platform detection
  Platform,
  
  // Native components
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  
  // Native bridge
  NativeRegistry,
  AppRegistry
};