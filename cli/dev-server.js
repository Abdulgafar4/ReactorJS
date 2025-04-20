// cli/dev-server.js - Development server

const fs = require('fs');
const path = require('path');

/**
 * Start the development server
 */
function startDevServer() {
  console.log('Starting development server...');
  
  const configPath = findConfigFile();
  if (!configPath) {
    console.error('Error: Could not find ReactorJS configuration file.');
    console.error('Make sure you have a reactorjs.config.js or reactorjs.config.ts file in your project.');
    process.exit(1);
  }
  
  try {
    const config = require(configPath);
    
    // Extract configuration
    const platforms = config.platforms || ['web'];
    const webConfig = config.web || {};
    const nativeConfig = config.native || {};
    
    const port = webConfig.devPort || 3000;
    
    console.log(`Detected platforms: ${platforms.join(', ')}`);
    
    // In a real implementation, this would:
    // 1. Set up bundler (webpack/vite) with hot module replacement
    // 2. Configure dev server middleware
    // 3. Handle static file serving from public dir
    // 4. Set up API routes if using server components
    // 5. For React Native, start the Metro bundler
    
    if (platforms.includes('web')) {
      console.log(`Starting web development server on port ${port}...`);
      startWebDevServer(webConfig);
    }
    
    if (platforms.includes('native')) {
      console.log('Starting React Native bundler...');
      startNativeDevServer(nativeConfig);
    }
    
  } catch (error) {
    console.error('Error starting development server:', error);
    process.exit(1);
  }
}

/**
 * Find the ReactorJS configuration file
 * @returns {string|null} Path to configuration file or null if not found
 */
function findConfigFile() {
  const cwd = process.cwd();
  
  // Check for JavaScript config first
  const jsConfig = path.join(cwd, 'reactorjs.config.js');
  if (fs.existsSync(jsConfig)) {
    return jsConfig;
  }
  
  // Then check for TypeScript config
  const tsConfig = path.join(cwd, 'reactorjs.config.ts');
  if (fs.existsSync(tsConfig)) {
    // In a real implementation, we'd need to handle TypeScript compilation
    console.warn('TypeScript configuration detected. In this demo, TypeScript processing is not fully implemented.');
    return tsConfig;
  }
  
  return null;
}

/**
 * Start the web development server
 * @param {Object} webConfig - Web configuration
 */
function startWebDevServer(webConfig) {
  // In a real implementation, this would:
  // 1. Set up a web server (Express/Koa)
  // 2. Configure bundler (webpack/vite) for HMR
  // 3. Set up middleware for serving static files
  // 4. Set up server-side rendering if enabled
  
  console.log('Web development server started (simulated)');
  console.log('In a real implementation, this would start a development server with:');
  console.log('- Hot Module Replacement (HMR)');
  console.log('- Server-side rendering (if enabled)');
  console.log('- API routes (if any)');
  console.log('- Static file serving from public directory');
  
  // Simulate server running
  console.log('\nListening on:');
  console.log(`- Local:   http://localhost:${webConfig.devPort || 3000}`);
  console.log(`- Network: http://${getLocalIp()}:${webConfig.devPort || 3000}`);
}

/**
 * Start the React Native development server
 * @param {Object} nativeConfig - Native configuration
 */
function startNativeDevServer(nativeConfig) {
  // In a real implementation, this would:
  // 1. Start Metro bundler
  // 2. Set up native debug server
  // 3. Configure platform-specific builds
  
  console.log('React Native development server started (simulated)');
  console.log('In a real implementation, this would:');
  console.log('- Start Metro bundler');
  console.log('- Configure native debugging');
  console.log('- Set up iOS and Android builds');
  
  // Simulate Metro bundler running
  console.log('\nMetro Bundler running on port 8081');
  console.log('To run on a device, use:');
  console.log('- iOS:     npx react-native run-ios');
  console.log('- Android: npx react-native run-android');
}

/**
 * Get local IP address for network access
 * @returns {string} Local IP address
 */
function getLocalIp() {
  // In a real implementation, we would use os.networkInterfaces()
  // to find a non-internal IPv4 address
  return '192.168.1.2';
}

module.exports = {
  startDevServer
};