#!/usr/bin/env node

// quick-test.js - Simple test to verify CLI functionality
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project name for testing
const projectName = 'test-app';
const projectPath = path.join(__dirname, projectName);

// Clean up any existing test project
if (fs.existsSync(projectPath)) {
  console.log(`Removing existing test project at ${projectPath}`);
  fs.removeSync(projectPath);
}

// Path to the CLI
const cliPath = path.join(__dirname, 'cli/index.js');

console.log('Running Clyra CLI Quick Test');
console.log('===========================');

// Try to create a project
try {
  console.log(`Creating test project: ${projectName}`);
  execSync(`node ${cliPath} create ${projectName} --typescript --tailwind`, { 
    stdio: 'inherit'
  });
  
  // Verify structure
  if (fs.existsSync(path.join(projectPath, 'package.json'))) {
    console.log('✅ package.json created');
  }
  
  if (fs.existsSync(path.join(projectPath, 'src/app/pages/home.tsx'))) {
    console.log('✅ Home page created');
  }
  
  if (fs.existsSync(path.join(projectPath, 'src/app/layouts/main.tsx'))) {
    console.log('✅ Main layout created');
  }
  
  console.log('\n✅ Quick test completed successfully!');
  console.log(`\nYou can explore the test project at: ${projectPath}`);
  console.log('To remove it, run: rm -rf test-app');
} catch (error) {
  console.error('❌ Error during quick test:', error.message);
  process.exit(1);
}