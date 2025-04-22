#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configurations
const testConfigurations = [
  {
    name: 'web-basic',
    options: []
  },
  {
    name: 'native-typescript',
    options: ['--platforms=native', '--typescript']
  },
  {
    name: 'full-featured',
    options: [
      '--platforms=both', 
      '--typescript', 
      '--tailwind', 
      '--shadcn'
    ]
  }
];

// Base test directory
const TEST_DIR = path.join(__dirname, 'test-projects');

// Ensure test directory exists
fs.ensureDirSync(TEST_DIR);

// Function to run CLI command
function runCliCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error);
    return false;
  }
}

// Function to run CLI directly (without relying on global installation)
function runCli(args) {
  const cliPath = path.join(__dirname, 'cli/index.js');
  const command = `node ${cliPath} ${args}`;
  return runCliCommand(command);
}

// Run tests
async function runTests() {
  console.log('Starting Clyra CLI Test Suite');
  console.log('==================================');

  for (const config of testConfigurations) {
    const projectPath = path.join(TEST_DIR, config.name);
    
    console.log(`\nTesting Project: ${config.name}`);
    console.log(`Options: ${config.options.join(' ')}`);

    // Clean existing project if exists
    if (fs.existsSync(projectPath)) {
      fs.removeSync(projectPath);
    }

    // Create project using direct CLI path
    const createCommand = `create ${projectPath} ${config.options.join(' ')}`;
    const createResult = runCli(createCommand);

    if (!createResult) {
      console.error(`Failed to create project: ${config.name}`);
      continue;
    }

    // Verify project structure
    const expectedDirs = [
      'src',
      'src/app',
      'src/app/components',
      'src/app/pages',
      'src/app/layouts',
      config.options.includes('--platforms=native') || config.options.includes('--platforms=both') 
        ? 'src/native/screens' 
        : null
    ].filter(Boolean);

    let structureValid = true;

    expectedDirs.forEach(dir => {
      const fullPath = path.join(projectPath, dir);
      if (!fs.existsSync(fullPath)) {
        console.error(`Missing expected directory: ${dir}`);
        structureValid = false;
      }
    });

    if (structureValid) {
      console.log(`Project ${config.name} created successfully!`);
    }
  }

  console.log('\nClyra CLI Test Suite Completed');
}

// Run the tests
runTests().catch(console.error);