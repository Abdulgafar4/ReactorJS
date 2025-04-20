
// index.js - Main entry point for ReactorJS framework

import * as Core from './core/index.js';
import * as Router from './router/index.js';
import * as Server from './server/index.js';
import * as Native from './native/index.js';
import * as State from './state/index.js';
import * as Styling from './styling/index.js';
import * as UI from './ui/index.js';

// Export the complete framework
const ReactorJS = {
  // Core module exports
  ...Core,
  
  // Include sub-modules as namespaced exports
  Router,
  Server,
  Native,
  State,
  Styling,
  UI
};

export default ReactorJS;// index.js - Main entry point for ReactorJS framework
