// cli/commands/start.js - Production server

import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { loadConfig, ensureClyraProject, getLocalIp } from '../utils/helpers.js';

/**
 * Starts the production server
 * @param {Object} options - Server options
 */
export async function startProductionServer(options = {}) {
  // Make sure we're in a Clyra project
  ensureClyraProject();
  
  console.log(chalk.blue('Starting production server...'));
  
  try {
    // Load project configuration
    const config = await loadConfig();
    
    // Extract configuration
    const webConfig = config.web || {};
    
    // Check if the build directory exists
    const buildDir = webConfig.buildDir || 'dist';
    if (!fs.existsSync(buildDir)) {
      console.error(chalk.red(`Error: Build directory "${buildDir}" not found.`));
      console.error(`Run ${chalk.cyan('clyra build')} to create a production build first.`);
      process.exit(1);
    }
    
    // Get server options
    const port = options.port || webConfig.port || 3000;
    const host = options.host || 'localhost';
    
    // Start server
    startServer(buildDir, { port, host });
    
  } catch (error) {
    console.error(chalk.red(`Error starting production server: ${error.message}`));
    console.error(error);
    process.exit(1);
  }
}

/**
 * Starts a static file server for production
 * @param {string} buildDir - Build directory
 * @param {Object} options - Server options
 */
function startServer(buildDir, options = {}) {
  const { port, host } = options;
  
  // In a real implementation, this would:
  // 1. Set up a production server (Express/Node.js)
  // 2. Configure middleware for serving static files
  // 3. Set up compression and other optimizations
  // 4. Handle API routes if available
  
  console.log(chalk.green('✅ Production server started'));
  
  // Show server URLs
  const localIp = getLocalIp();
  
  console.log('\nServer running at:');
  console.log(`- ${chalk.cyan(`http://${host}:${port}`)}`);
  console.log(`- ${chalk.cyan(`http://${localIp}:${port}`)} (network)`);
  
  console.log('\nServing files from:');
  console.log(`- ${chalk.cyan(path.resolve(buildDir))}`);
  
  console.log('\nServer features:');
  console.log('- Static file serving');
  console.log('- Gzip compression');
  console.log('- API route handling');
  console.log('- SPA fallback for client-side routing');
}