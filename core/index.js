// core/index.js - Main entry point for the core module

import { VNode, createElement, createTextElement } from './vdom.js';
import { render, createDOMElement, updateDOM } from './renderer.js';
import { Component, createComponent, FunctionalComponent } from './component.js';
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  createContext
} from './hooks.js';
import { reactive, watchEffect, computed } from './reactivity.js';

// Export all core functionality
export {
  // Virtual DOM
  VNode,
  createElement,
  createTextElement,
  
  // Renderer
  render,
  createDOMElement,
  updateDOM,
  
  // Component system
  Component,
  createComponent,
  FunctionalComponent,
  
  // Hooks
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  createContext,
  
  // Reactivity
  reactive,
  watchEffect,
  computed
};