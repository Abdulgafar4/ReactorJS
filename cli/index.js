#!/usr/bin/env node
// cli/index.js - Main CLI entry point for the Clyra framework

import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from './commands/create.js';
import { startDevServer } from './commands/dev.js';
import { buildProject } from './commands/build.js';
import { startProductionServer } from './commands/start.js';
import { generateFiles } from './commands/generate.js';
import { createSampleFiles } from './utils/sample-files.js';
import { getPackageInfo } from './utils/helpers.js';

// Get package information
const packageInfo = getPackageInfo();

// Create a new CLI program
const program = new Command();

// Setup CLI metadata
program
  .name('clyra')
  .description('Clyra - A comprehensive JavaScript framework for building web and native applications')
  .version(packageInfo.version, '-v, --version', 'Output the current version');

// Create command - Generate a new project
program
  .command('create <name>')
  .description('Create a new Clyra project')
  .option('-p, --platforms <platforms>', 'Platforms to support (web, native, or both)', 'both')
  .option('-t, --typescript', 'Use TypeScript')
  .option('--tailwind', 'Include Tailwind CSS', true)
  .option('--shadcn', 'Include shadcn/ui components', true)
  .option('--skip-install', 'Skip dependency installation')
  .option('--skip-git', 'Skip git initialization')
  .action((name, options) => {
    console.log(chalk.blue(`Creating new Clyra project: ${name}`));
    createProject(name, options);
  });

// Dev command - Start development server
program
  .command('dev')
  .description('Start development server')
  .option('-p, --port <port>', 'Port number to use', '3000')
  .option('--host <host>', 'Host to bind to', 'localhost')
  .option('--open', 'Open in browser automatically', false)
  .action((options) => {
    console.log(chalk.blue('Starting development server...'));
    startDevServer(options);
  });

// Build command - Build for production
program
  .command('build [platform]')
  .description('Build project for production')
  .option('--analyze', 'Analyze bundle size')
  .option('--no-sourcemap', 'Disable source maps')
  .action((platform, options) => {
    const platformArg = platform || 'all';
    console.log(chalk.blue(`Building project for ${platformArg}...`));
    buildProject(platformArg, options);
  });

// Generate command - Generate components, pages, etc.
program
  .command('generate <type> <name>')
  .alias('g')
  .description('Generate components, pages, layouts, etc.')
  .option('-p, --platform <platform>', 'Target platform (web, native)', 'web')
  .option('-d, --dir <directory>', 'Target directory')
  .option('--typescript', 'Generate TypeScript files')
  .option('--force', 'Overwrite existing files')
  .action((type, name, options) => {
    console.log(chalk.blue(`Generating ${type}: ${name}`));
    generateFiles(type, name, options);
  });

// Start command - Start production server
program
  .command('start')
  .description('Start the production server')
  .option('-p, --port <port>', 'Port number to use', '3000')
  .option('--host <host>', 'Host to bind to', 'localhost')
  .action((options) => {
    console.log(chalk.blue('Starting production server...'));
    startProductionServer(options);
  });

// Add hidden sample command for development/testing
program
  .command('sample <dir>')
  .description('Generate sample project files (for development/testing)')
  .option('-p, --platforms <platforms>', 'Platforms to support (web, native, or both)', 'both')
  .option('-t, --typescript', 'Use TypeScript')
  .option('--tailwind', 'Include Tailwind CSS')
  .option('--shadcn', 'Include shadcn/ui components')
  // .hidden()
  .action((dir, options) => {
    console.log(chalk.blue(`Generating sample files in: ${dir}`));
    createSampleFiles(dir, {
      platforms: options.platforms || 'both',
      useTypeScript: !!options.typescript,
      includeTailwind: !!options.tailwind,
      includeShadcn: !!options.shadcn
    });
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command is provided
if (!process.argv.slice(2).length) {
  program.help();
}