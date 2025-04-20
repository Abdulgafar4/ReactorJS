#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

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
const TEST_DIR = path.join(process.cwd(), 'test-projects');

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

// Run tests
async function runTests() {
  console.log('Starting ReactorJS CLI Test Suite');
  console.log('==================================');

  for (const config of testConfigurations) {
    const projectPath = path.join(TEST_DIR, config.name);
    
    console.log(`\nTesting Project: ${config.name}`);
    console.log(`Options: ${config.options.join(' ')}`);

    // Clean existing project if exists
    if (fs.existsSync(projectPath)) {
      fs.removeSync(projectPath);
    }

    // Create project
    const createCommand = `reactorjs create ${projectPath} ${config.options.join(' ')}`;
    const createResult = runCliCommand(createCommand);

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

    expectedDirs.forEach(dir => {
      const fullPath = path.join(projectPath, dir);
      if (!fs.existsSync(fullPath)) {
        console.error(`Missing expected directory: ${fullPath}`);
      }
    });

    // Additional tests can be added here (like checking specific files, running dev server, etc.)
    console.log(`Project ${config.name} created successfully!`);
  }

  console.log('\nReactorJS CLI Test Suite Completed');
}

// Run the tests
runTests().catch(console.error);