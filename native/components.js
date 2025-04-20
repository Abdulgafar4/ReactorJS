// native/components.js - Native components

import { createElement } from '../core/vdom.js';

/**
 * View component - container for other components
 * Maps to div in web, View in React Native
 */
const View = props => createElement('div', { 
  ...props, 
  className: `rn-view ${props.className || ''}` 
}, props.children);

/**
 * Text component - displays text
 * Maps to span in web, Text in React Native
 */
const Text = props => createElement('span', { 
  ...props, 
  className: `rn-text ${props.className || ''}` 
}, props.children);

/**
 * Image component - displays images
 * Maps to img in web, Image in React Native
 */
const Image = props => createElement('img', { 
  ...props, 
  className: `rn-image ${props.className || ''}`, 
  src: props.source?.uri || props.source 
}, null);

/**
 * TouchableOpacity component - pressable area with opacity feedback
 * Maps to div with click handler in web, TouchableOpacity in React Native
 */
const TouchableOpacity = props => {
  const { onPress, style, children, ...rest } = props;
  return createElement('div', { 
    ...rest, 
    onClick: onPress, 
    style: { cursor: 'pointer', opacity: 0.8, ...style },
    className: `rn-touchable ${props.className || ''}`
  }, children);
};

/**
 * StyleSheet utility - similar to React Native's StyleSheet
 */
const StyleSheet = {
  create(styles) {
    return Object.keys(styles).reduce((acc, key) => {
      acc[key] = styles[key];
      return acc;
    }, {});
  }
};

export {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
};