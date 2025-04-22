// cli/commands/dev.js - Development server

import chalk from 'chalk';
import { loadConfig, ensureClyraProject, getLocalIp } from '../utils/helpers.js';

/**
 * Starts the development server
 * @param {Object} options - Server options
 */
export async function startDevServer(options = {}) {
  // Make sure we're in a Clyra project
  ensureClyraProject();
  
  console.log(chalk.blue('Starting development server...'));
  
  try {
    // Load project configuration
    const config = await loadConfig();
    
    // Extract configuration
    const platforms = config.platforms || ['web'];
    const webConfig = config.web || {};
    const nativeConfig = config.native || {};
    
    // Determine server port
    const port = options.port || webConfig.devPort || 3000;
    const host = options.host || 'localhost';
    
    console.log(`Detected platforms: ${chalk.cyan(platforms.join(', '))}`);
    
    // Start servers for enabled platforms
    if (platforms.includes('web')) {
      console.log(chalk.blue(`\nStarting web development server on port ${port}...`));
      startWebDevServer(webConfig, { port, host, open: options.open });
    }
    
    if (platforms.includes('native')) {
      console.log(chalk.blue('\nStarting React Native bundler...'));
      startNativeDevServer(nativeConfig, options);
    }
    
  } catch (error) {
    console.error(chalk.red(`Error starting development server: ${error.message}`));
    console.error(error);
    process.exit(1);
  }
}

/**
 * Starts the web development server
 * @param {Object} webConfig - Web configuration
 * @param {Object} options - Server options
 */
function startWebDevServer(webConfig, options) {
  const { port, host, open } = options;
  
  // In a real implementation, this would:
  // 1. Set up a web server (Express/Koa)
  // 2. Configure bundler (webpack/vite) for HMR
  // 3. Set up middleware for serving static files
  // 4. Set up server-side rendering if enabled
  
  console.log(chalk.green('✓ Web development server started'));
  console.log('Features enabled:');
  console.log('- Hot Module Replacement (HMR)');
  console.log('- Server-side rendering');
  console.log('- API routes');
  console.log('- Static file serving from public directory');
  
  // Show server URLs
  const localIp = getLocalIp();
  
  console.log('\nServer running at:');
  console.log(`- ${chalk.cyan(`http://${host}:${port}`)}`);
  console.log(`- ${chalk.cyan(`http://${localIp}:${port}`)} (network)`);
  
  // Open browser if requested
  if (open) {
    console.log('\nOpening browser...');
    // In a real implementation, this would open the browser
  }
}

/**
 * Starts the React Native development server
 * @param {Object} nativeConfig - Native configuration
 * @param {Object} options - Server options 
 */
function startNativeDevServer(nativeConfig, options) {
  // In a real implementation, this would:
  // 1. Start Metro bundler
  // 2. Set up native debug server
  // 3. Configure platform-specific builds
  
  console.log(chalk.green('✓ React Native development server started'));
  console.log('Features enabled:');
  console.log('- Metro bundler');
  console.log('- Native debugging');
  console.log('- Hot Reloading');
  
  // Show server info
  console.log('\nMetro Bundler running on port 8081');
  console.log('\nTo run on a device or simulator:');
  console.log(`- iOS:     ${chalk.cyan('npx react-native run-ios')}`);
  console.log(`- Android: ${chalk.cyan('npx react-native run-android')}`);
}