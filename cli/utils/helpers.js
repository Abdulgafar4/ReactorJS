// cli/utils/helpers.js - Utility functions for the CLI

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { execSync } from 'child_process';

/**
 * Gets the package information from package.json
 * @returns {Object} Package information
 */
export function getPackageInfo() {
  try {
    // Get the directory where this file is located
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Navigate to the package.json (up two levels from utils folder)
    const packagePath = path.resolve(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    
    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description
    };
  } catch (error) {
    console.warn('Could not read package.json:', error.message);
    return {
      name: 'clyra',
      version: '0.1.0',
      description: 'A comprehensive JavaScript framework'
    };
  }
}

/**
 * Finds the Clyra configuration file in the current directory
 * @returns {string|null} Path to the config file or null if not found
 */
export function findConfigFile() {
  const cwd = process.cwd();
  
  // Check for JavaScript config first
  const jsConfig = path.join(cwd, 'clyra.config.js');
  if (fs.existsSync(jsConfig)) {
    return jsConfig;
  }
  
  // Then check for TypeScript config
  const tsConfig = path.join(cwd, 'clyra.config.ts');
  if (fs.existsSync(tsConfig)) {
    console.log(chalk.yellow('TypeScript configuration detected. Ensure ts-node is installed for full TypeScript support.'));
    return tsConfig;
  }
  
  return null;
}

/**
 * Loads the Clyra configuration
 * @returns {Object} Configuration object
 */
export async function loadConfig() {
  const configPath = findConfigFile();
  
  if (!configPath) {
    console.error(chalk.red('Error: Could not find Clyra configuration file.'));
    console.error('Make sure you have a clyra.config.js or clyra.config.ts file in your project.');
    process.exit(1);
  }
  
  try {
    // Use dynamic import since we're in an ES module
    const importedConfig = await import(configPath);
    return importedConfig.default || importedConfig;
  } catch (error) {
    console.error(chalk.red(`Error loading configuration: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Validates project name
 * @param {string} name - Project name to validate
 * @returns {string} Validated project name
 */
export function validateProjectName(name) {
  if (!name) {
    console.error(chalk.red('Error: Project name is required'));
    process.exit(1);
  }
  
  // Remove special characters and spaces, convert to kebab-case
  const sanitizedName = name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
  
  if (sanitizedName !== name) {
    console.log(chalk.yellow(`Project name was sanitized to: ${sanitizedName}`));
  }
  
  return sanitizedName;
}

/**
 * Checks if a command is available
 * @param {string} command - Command to check
 * @returns {boolean} Whether the command is available
 */
export function commandExists(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get the local IP address for network access
 * @returns {string} Local IP address
 */
export function getLocalIp() {
  try {
    const { networkInterfaces } = require('os');
    const interfaces = networkInterfaces();
    
    for (const iface of Object.values(interfaces)) {
      for (const alias of iface) {
        if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address;
        }
      }
    }
    
    return '127.0.0.1'; // Fallback to localhost
  } catch (error) {
    return '127.0.0.1';
  }
}

/**
 * Checks if the current directory is a Clyra project
 * @returns {boolean} Whether the current directory is a Clyra project
 */
export function isClyraProject() {
  return !!findConfigFile();
}

/**
 * Ensures the current directory is a Clyra project
 */
export function ensureClyraProject() {
  if (!isClyraProject()) {
    console.error(chalk.red('Error: Not a Clyra project directory'));
    console.error('Run this command from a Clyra project directory or create a new project with:');
    console.error(chalk.cyan('  clyra create my-app'));
    process.exit(1);
  }
}