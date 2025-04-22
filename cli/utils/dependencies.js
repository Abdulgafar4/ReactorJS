// cli/utils/dependencies.js - Dependency management utilities

import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * List of core dependencies for Clyra projects
 */
export const coreDependencies = {
  dependencies: [
    'clyra'
  ],
  devDependencies: []
};

/**
 * List of TypeScript dependencies
 */
export const typeScriptDependencies = {
  dependencies: [],
  devDependencies: [
    'typescript',
    '@types/node',
    '@types/react',
    '@types/react-dom'
  ]
};

/**
 * List of styling dependencies
 */
export const stylingDependencies = {
  tailwind: {
    dependencies: [],
    devDependencies: [
      'tailwindcss',
      'postcss',
      'autoprefixer'
    ]
  },
  shadcn: {
    dependencies: [
      'class-variance-authority',
      'clsx',
      'tailwind-merge'
    ],
    devDependencies: []
  }
};

/**
 * List of ESLint dependencies
 */
export const lintingDependencies = {
  dependencies: [],
  devDependencies: [
    'eslint',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks'
  ]
};

/**
 * Get the latest versions of packages
 * @param {string[]} packages - List of package names
 * @returns {Object} Object mapping package names to latest versions
 */
export function getLatestVersions(packages) {
  const versions = {};
  
  console.log(chalk.blue('Looking up latest package versions...'));
  
  try {
    for (const pkg of packages) {
      try {
        // Execute npm view command to get the latest version
        const latestVersion = execSync(`npm view ${pkg} version`, { 
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'ignore'] // Redirect stderr to ignore warnings
        }).trim();
        
        versions[pkg] = `^${latestVersion}`;
      } catch (error) {
        console.warn(chalk.yellow(`Could not fetch version for ${pkg}, using default`));
        versions[pkg] = '*'; // Use wildcard as fallback
      }
    }
  } catch (error) {
    console.warn(chalk.yellow(`Error fetching package versions: ${error.message}`));
    console.warn(chalk.yellow('Using default versions instead'));
    
    // Use default versions for all packages
    packages.forEach(pkg => {
      versions[pkg] = '*';
    });
  }
  
  return versions;
}

/**
 * Generates package.json dependencies with the latest versions
 * @param {Object} options - Project options
 * @returns {Object} Dependencies object for package.json
 */
export function generateDependencies(options) {
  // Initialize dependencies lists
  const dependencies = [...coreDependencies.dependencies];
  const devDependencies = [...coreDependencies.devDependencies];
  
  // Add TypeScript dependencies if needed
  if (options.typescript) {
    dependencies.push(...typeScriptDependencies.dependencies);
    devDependencies.push(...typeScriptDependencies.devDependencies);
  }
  
  // Add Tailwind dependencies if needed
  if (options.tailwind) {
    dependencies.push(...stylingDependencies.tailwind.dependencies);
    devDependencies.push(...stylingDependencies.tailwind.devDependencies);
  }
  
  // Add shadcn/ui dependencies if needed
  if (options.shadcn) {
    dependencies.push(...stylingDependencies.shadcn.dependencies);
    devDependencies.push(...stylingDependencies.shadcn.devDependencies);
  }
  
  // Add linting dependencies
  devDependencies.push(...lintingDependencies.devDependencies);
  
  // Get latest versions
  const latestDependencies = getLatestVersions(dependencies);
  const latestDevDependencies = getLatestVersions(devDependencies);
  
  // Create dependency objects
  const dependenciesObj = {};
  const devDependenciesObj = {};
  
  dependencies.forEach(pkg => {
    dependenciesObj[pkg] = latestDependencies[pkg] || '*';
  });
  
  devDependencies.forEach(pkg => {
    devDependenciesObj[pkg] = latestDevDependencies[pkg] || '*';
  });
  
  return {
    dependencies: dependenciesObj,
    devDependencies: devDependenciesObj
  };
}