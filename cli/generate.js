#!/usr/bin/env node
// cli/index.js - Main CLI entry point

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import { createNewProject } from './create-app.js';

// Package information
const packageJSON = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

// Create program
const program = new Command();

// Setup CLI
program
  .name('clyra')
  .description('Clyra - A comprehensive JavaScript framework CLI for building web and native applications')
  .version(packageJSON.version);

// Create command
program
  .command('create')
  .description('Create a new Clyra project')
  .argument('[project-name]', 'Name of the project')
  .action((projectName, options) => {
    if (!projectName) {
      console.error(chalk.red('Error: Please provide a project name'));
      console.log('Example: clyra create my-app');
      process.exit(1);
    }
    
    createNewProject([projectName]);
  });

// Dev command
program
  .command('dev')
  .description('Start development server')
  .option('-p, --port <number>', 'Port to run the server on', '3000')
  .action((options) => {
    console.log(chalk.blue('Starting development server...'));
    try {
      // Import the dev script dynamically
      import('./dev.js').then((module) => {
        module.startDevServer(options);
      }).catch((error) => {
        console.error(chalk.red(`Error starting development server: ${error.message}`));
        process.exit(1);
      });
    } catch (error) {
      console.error(chalk.red(`Error starting development server: ${error.message}`));
      process.exit(1);
    }
  });

// Build command
program
  .command('build')
  .description('Build the application for production')
  .option('-t, --target <platform>', 'Target platform (web, native, both)', 'web')
  .action((options) => {
    console.log(chalk.blue('Building application...'));
    try {
      // Import the build script dynamically
      import('./build.js').then((module) => {
        module.buildProject(options);
      }).catch((error) => {
        console.error(chalk.red(`Error building application: ${error.message}`));
        process.exit(1);
      });
    } catch (error) {
      console.error(chalk.red(`Error building application: ${error.message}`));
      process.exit(1);
    }
  });

// Start command
program
  .command('start')
  .description('Run the production build')
  .option('-p, --port <number>', 'Port to run the server on', '3000')
  .action((options) => {
    console.log(chalk.blue('Starting production server...'));
    try {
      // Import the start script dynamically
      import('./start.js').then((module) => {
        module.startProductionServer(options);
      }).catch((error) => {
        console.error(chalk.red(`Error starting production server: ${error.message}`));
        process.exit(1);
      });
    } catch (error) {
      console.error(chalk.red(`Error starting production server: ${error.message}`));
      process.exit(1);
    }
  });

// Generate component command
program
  .command('generate')
  .alias('g')
  .description('Generate project files')
  .argument('<type>', 'Type of file to generate (component, page, layout, screen)')
  .argument('<name>', 'Name of the file to generate')
  .option('-p, --platform <platform>', 'Target platform (web, native)', 'web')
  .action((type, name, options) => {
    console.log(chalk.blue(`Generating ${type}: ${name}...`));
    try {
      // Import the generate script dynamically
      import('./generate.js').then((module) => {
        module.generateFile(type, name, options);
      }).catch((error) => {
        console.error(chalk.red(`Error generating ${type}: ${error.message}`));
        process.exit(1);
      });
    } catch (error) {
      console.error(chalk.red(`Error generating ${type}: ${error.message}`));
      process.exit(1);
    }
  });

// Parse arguments
program.parse(process.argv);

// Show help if no arguments
if (!process.argv.slice(2).length) {
  program.outputHelp();
}