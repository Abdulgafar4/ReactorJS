#!/usr/bin/env node

// cli/index.js - Main CLI entry point with enhanced command handling

import { Command } from 'commander';
import chalk from 'chalk';
import { createNewProject } from './create-app.js';
import { startDevServer } from './dev-server.js';
import { generateComponent } from './generate.js';
import { createSampleFiles } from './sample-files.js';
import buildProject  from './build.js';

// Create a new CLI program
const program = new Command();

// Set program metadata
program
  .name('clyra')
  .description('Clyra CLI - Build full-stack web and native applications')
  .version('0.1.0', '-v, --version', 'Output the current version');

// Create command for generating projects
program
  .command('create <n>')
  .description('Create a new Clyra project')
  .option('-p, --platforms <platforms>', 'Platforms to support (web, native, or both)', 'both')
  .option('-t, --typescript', 'Use TypeScript')
  .option('--tailwind', 'Include Tailwind CSS')
  .option('--shadcn', 'Include shadcn/ui components')
  .action((name, options) => {
    console.log(chalk.blue(`Creating new Clyra project: ${name}`));
    
    createNewProject([name, ...(
      Object.entries(options)
        .filter(([key]) => ['platforms', 'typescript', 'tailwind', 'shadcn'].includes(key))
        .map(([key, value]) => `--${key}=${value}`)
    )]);
  });

// Development server command
program
  .command('dev')
  .description('Start development server')
  .action(() => {
    console.log(chalk.blue('Starting development server...'));
    startDevServer();
  });

// Build command
program
  .command('build [platform]')
  .description('Build project for production')
  .action((platform) => {
    console.log(chalk.blue(`Building project${platform ? ` for ${platform}` : ''}`));
    buildProject(platform ? [platform] : []);
  });

// Generate command
program
  .command('generate <type> <n>')
  .description('Generate components, pages, layouts, etc.')
  .action((type, name) => {
    console.log(chalk.blue(`Generating ${type}: ${name}`));
    generateComponent([type, name]);
  });

// Sample files command (for debugging/development)
program
  .command('sample <dir>')
  .description('Generate sample project files (for development/testing)')
  .option('-p, --platforms <platforms>', 'Platforms to support (web, native, or both)', 'both')
  .option('-t, --typescript', 'Use TypeScript')
  .option('--tailwind', 'Include Tailwind CSS')
  .option('--shadcn', 'Include shadcn/ui components')
  .action((dir, options) => {
    console.log(chalk.blue(`Generating sample files in: ${dir}`));
    
    createSampleFiles(dir, {
      platforms: options.platforms || 'both',
      useTypeScript: !!options.typescript,
      includeTailwind: !!options.tailwind,
      includeShadcn: !!options.shadcn
    });
  });

// Start command (for production server)
program
  .command('start')
  .description('Start the production server')
  .action(() => {
    console.log(chalk.blue('Starting production server...'));
    console.log(chalk.yellow('Not implemented in this demo version.'));
    process.exit(1);
  });

// Help command
program
  .command('help')
  .description('Show help information')
  .action(() => {
    program.help();
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command is provided
if (!process.argv.slice(2).length) {
  program.help();
}