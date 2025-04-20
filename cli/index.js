#!/usr/bin/env node

// cli/index.js - Main CLI entry point

const { createNewProject } = require('./create-app');
const { startDevServer } = require('./dev-server');
const { buildProject } = require('./build');
const { generateComponent } = require('./generate');

/**
 * Print help information
 */
function printHelp() {
  console.log(`
ReactorJS CLI - Build full-stack web and native applications

Commands:
  create [name]          Create a new ReactorJS project
  dev                    Start development server
  build [platform]       Build project for production (web, native, or all)
  start                  Start the production server
  generate [type] [name] Generate a new component, page, or layout
  help                   Show this help message

Examples:
  reactorjs create my-app
  reactorjs dev
  reactorjs build web
  reactorjs build native
  reactorjs generate component Button
  reactorjs generate page Home
  `);
  process.exit(0);
}

/**
 * Start the production server
 */
function startProject() {
  console.log('Starting production server...');
  
  // In a real implementation, this would:
  // 1. Load the ReactorJS config
  // 2. Start a production-ready server
  console.log('Production server not implemented in this demo.');
  
  process.exit(0);
}

/**
 * Main CLI entry point
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'create':
      createNewProject(args.slice(1));
      break;
    case 'dev':
      startDevServer();
      break;
    case 'build':
      buildProject(args.slice(1));
      break;
    case 'start':
      startProject();
      break;
    case 'generate':
      generateComponent(args.slice(1));
      break;
    case 'help':
    default:
      printHelp();
      break;
  }
}

// Run the CLI
main();