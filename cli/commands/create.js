// cli/commands/create.js - Project creation command

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { createInterface } from 'readline';
import { validateProjectName, commandExists } from '../utils/helpers.js';
import { createSampleFiles } from '../utils/sample-files.js';
import { generateDependencies } from '../utils/dependencies.js';

/**
 * Creates interactive readline interface
 * @returns {readline.Interface} Readline interface
 */
function createPrompt() {
  return createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Asks a question with a default value
 * @param {readline.Interface} rl - Readline interface
 * @param {string} question - Question to ask
 * @param {string|boolean} defaultValue - Default value
 * @returns {Promise<string>} User response
 */
function askQuestion(rl, question, defaultValue) {
  const defaultText = defaultValue !== undefined ? ` (${defaultValue})` : '';
  
  return new Promise((resolve) => {
    rl.question(`${question}${defaultText}: `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

/**
 * Creates a new Clyra project
 * @param {string} projectName - Name of the project
 * @param {Object} options - Command line options
 */
export async function createProject(projectName, options) {
  // Validate and sanitize project name
  const validName = validateProjectName(projectName);
  const projectDir = path.resolve(process.cwd(), validName);
  
  // Check if directory already exists
  if (fs.existsSync(projectDir)) {
    console.error(chalk.red(`Error: Directory ${validName} already exists`));
    process.exit(1);
  }
  
  console.log(`Creating a new Clyra project in ${chalk.green(projectDir)}...`);
  
  // If interactive mode (no flags specified), ask for configuration
  let projectOptions = { ...options };
  
  if (!options.platforms && !options.typescript && !options.tailwind && !options.shadcn) {
    const rl = createPrompt();
    
    // Ask for project configuration
    const platforms = await askQuestion(rl, 'What platforms do you want to target? (web, native, both)', 'both');
    const useTypeScript = (await askQuestion(rl, 'Use TypeScript?', 'y')).toLowerCase() === 'y';
    const includeTailwind = (await askQuestion(rl, 'Include Tailwind CSS?', 'y')).toLowerCase() === 'y';
    const includeShadcn = (await askQuestion(rl, 'Include shadcn/ui components?', 'y')).toLowerCase() === 'y';
    
    projectOptions = {
      ...projectOptions,
      platforms,
      typescript: useTypeScript,
      tailwind: includeTailwind,
      shadcn: includeShadcn
    };
    
    rl.close();
  }
  
  try {
    // Create project directory
    fs.mkdirSync(projectDir, { recursive: true });
    
    // Create project structure
    createProjectStructure(projectDir, projectOptions);
    
    console.log(chalk.green('✅ Project structure created successfully'));
    
    // Install dependencies
    if (!options.skipInstall) {
      await installDependencies(projectDir);
    } else {
      console.log(chalk.yellow('Skipping dependency installation (--skip-install)'));
    }
    
    // Initialize git repository
    if (!options.skipGit) {
      await initializeGit(projectDir);
    } else {
      console.log(chalk.yellow('Skipping git initialization (--skip-git)'));
    }
    
    // Display success message
    displaySuccessMessage(validName, projectOptions, options);
    
  } catch (error) {
    console.error(chalk.red(`Error creating project: ${error.message}`));
    console.error(error);
    process.exit(1);
  }
}

/**
 * Creates the project directory structure
 * @param {string} projectDir - Project directory
 * @param {Object} options - Project options
 */
function createProjectStructure(projectDir, options) {
  console.log('Setting up project structure...');
  
  const useTypeScript = !!options.typescript;
  const ext = useTypeScript ? 'ts' : 'js';
  const jsxExt = useTypeScript ? 'tsx' : 'jsx';
  
  // Get dependencies with latest versions
  const { dependencies, devDependencies } = generateDependencies(options);
  
  // Create package.json
  const packageJson = {
    name: path.basename(projectDir),
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'clyra dev',
      build: 'clyra build',
      start: 'clyra start',
      lint: useTypeScript 
        ? 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0' 
        : 'eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0'
    },
    dependencies,
    devDependencies
  };
  
  // Write package.json
  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create standard project directories
  createDirectoryStructure(projectDir, options);
  
  // Create configuration files
  createConfigFiles(projectDir, options);
  
  // Create sample files
  createSampleFiles(projectDir, {
    platforms: options.platforms,
    useTypeScript: useTypeScript,
    includeTailwind: options.tailwind,
    includeShadcn: options.shadcn
  });
}

/**
 * Creates the project directory structure
 * @param {string} projectDir - Project directory
 * @param {Object} options - Project options 
 */
function createDirectoryStructure(projectDir, options) {
  console.log('Creating directory structure...');
  
  const dirs = [
    'src',
    'src/app',
    'src/app/pages',
    'src/app/layouts',
    'src/app/components',
    'src/styles',
    'public'
  ];
  
  if (options.platforms === 'native' || options.platforms === 'both') {
    dirs.push('src/native');
    dirs.push('src/native/screens');
    dirs.push('src/native/components');
  }
  
  dirs.forEach(dir => {
    fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
  });
}

/**
 * Creates configuration files for the project
 * @param {string} projectDir - Project directory
 * @param {Object} options - Project options
 */
function createConfigFiles(projectDir, options) {
  console.log('Creating configuration files...');
  
  const useTypeScript = !!options.typescript;
  const ext = useTypeScript ? 'ts' : 'js';
  
  // Create TypeScript configuration files if needed
  if (useTypeScript) {
    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'preserve',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthrough: true
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }]
    };
    
    const tsConfigNode = {
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowSyntheticDefaultImports: true
      },
      include: ['clyra.config.ts']
    };
    
    fs.writeFileSync(
      path.join(projectDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
    
    fs.writeFileSync(
      path.join(projectDir, 'tsconfig.node.json'),
      JSON.stringify(tsConfigNode, null, 2)
    );
  }
  
  // Create Clyra configuration file
  const clyraConfig = `// Clyra configuration file
${useTypeScript ? 'export default ' : 'export default '}({
  // General settings
  appName: '${path.basename(projectDir)}',
  
  // Platforms to build for
  platforms: ['${options.platforms === 'both' ? ('web', 'native') : options.platforms}'],
  
  // Web configuration
  web: {
    devPort: 3000,
    buildDir: 'dist',
    publicDir: 'public',
  },
  
  // Native configuration
  native: {
    appId: 'com.example.${path.basename(projectDir).toLowerCase().replace(/[^a-z0-9]/g, '')}',
    platforms: ['ios', 'android'],
  },
  
  // Styling options
  styling: {
    tailwind: ${!!options.tailwind},
    shadcn: ${!!options.shadcn},
    theme: {
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
      }
    }
  }
});
`;
  
  fs.writeFileSync(
    path.join(projectDir, `clyra.config.${ext}`),
    clyraConfig
  );
  
  // Create Tailwind configuration if needed
  if (options.tailwind) {
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
      },
    },
  },
  plugins: [],
};
`;
    
    fs.writeFileSync(
      path.join(projectDir, 'tailwind.config.js'),
      tailwindConfig
    );
    
    // Create PostCSS config
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
    
    fs.writeFileSync(
      path.join(projectDir, 'postcss.config.js'),
      postcssConfig
    );
    
    // Create global CSS file
    const globalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #3b82f6;
  --secondary: #6b7280;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;
    
    fs.writeFileSync(
      path.join(projectDir, 'src/styles/globals.css'),
      globalCss
    );
  }
  
  // Create gitignore
  const gitignore = `# Dependencies
node_modules/
.pnp/
.pnp.js

# Build output
dist/
build/
.output/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Cache and logs
.cache/
.temp/
.log/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Native platform-specific
ios/Pods/
android/build/
android/app/build/
`;
  
  fs.writeFileSync(
    path.join(projectDir, '.gitignore'),
    gitignore
  );
  
  // Create README
  const readmeContent = `# ${path.basename(projectDir)}

This project was created with [Clyra](https://clyra.vercel.app/).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- \`src/app/\`: Web application code
  - \`pages/\`: Page components
  - \`layouts/\`: Layout components
  - \`components/\`: Reusable components
${options.platforms === 'native' || options.platforms === 'both' ? 
`- \`src/native/\`: Native application code
  - \`screens/\`: Screen components
  - \`components/\`: Native-specific components` : ''}
- \`src/styles/\`: Global styles
- \`public/\`: Static assets

## Learn More

To learn more about Clyra, check out the [Clyra documentation](https://clyra.vercel.app/docs).
`;

  fs.writeFileSync(
    path.join(projectDir, 'README.md'),
    readmeContent
  );
}

/**
 * Installs project dependencies
 * @param {string} projectDir - Project directory
 */
async function installDependencies(projectDir) {
  console.log(chalk.blue('Installing dependencies...'));
  
  try {
    // Determine package manager (prefer yarn if available)
    const useYarn = commandExists('yarn');
    const packageManager = useYarn ? 'yarn' : 'npm';
    const installCommand = useYarn ? 'yarn' : 'npm install';
    
    console.log(`Using ${packageManager} to install dependencies...`);
    
    // Run install command
    execSync(installCommand, { 
      cwd: projectDir, 
      stdio: 'inherit' 
    });
    
    console.log(chalk.green('✅ Dependencies installed successfully'));
    
  } catch (error) {
    console.error(chalk.yellow('⚠️ Failed to install dependencies'));
    console.error(chalk.yellow('You can install them later manually by running:'));
    console.error(chalk.cyan(`  cd ${path.basename(projectDir)} && npm install`));
  }
}

/**
 * Initializes a git repository
 * @param {string} projectDir - Project directory 
 */
async function initializeGit(projectDir) {
  console.log(chalk.blue('Initializing git repository...'));
  
  try {
    // Check if git is available
    if (!commandExists('git')) {
      console.warn(chalk.yellow('⚠️ Git not found. Skipping repository initialization.'));
      return;
    }
    
    // Initialize git repository
    execSync('git init', { cwd: projectDir, stdio: 'ignore' });
    
    // Create initial commit
    execSync('git add .', { cwd: projectDir, stdio: 'ignore' });
    execSync('git commit -m "Initial commit from Clyra CLI"', { 
      cwd: projectDir, 
      stdio: 'ignore'
    });
    
    console.log(chalk.green('✅ Git repository initialized successfully'));
    
  } catch (error) {
    console.warn(chalk.yellow('⚠️ Failed to initialize git repository'));
    console.warn('You can initialize it later manually with:');
    console.warn(chalk.cyan(`  cd ${path.basename(projectDir)} && git init`));
  }
}

/**
 * Displays success message after project creation
 * @param {string} projectName - Project name
 * @param {Object} projectOptions - Project options
 * @param {Object} commandOptions - Command options
 */
function displaySuccessMessage(projectName, projectOptions, commandOptions) {
  console.log(`
${chalk.green('✅ Your Clyra project was created successfully!')}

Created a new Clyra application with:
${chalk.cyan('- Platforms:')} ${projectOptions.platforms}
${chalk.cyan('- TypeScript:')} ${projectOptions.typescript ? 'Yes' : 'No'}
${chalk.cyan('- Tailwind CSS:')} ${projectOptions.tailwind ? 'Yes' : 'No'}
${chalk.cyan('- shadcn/ui components:')} ${projectOptions.shadcn ? 'Yes' : 'No'}

${chalk.bold('Next steps:')}

  ${chalk.cyan(`cd ${projectName}`)}
  ${commandOptions.skipInstall ? chalk.cyan('npm install') + ' (or yarn)' : ''}
  ${chalk.cyan('npm run dev')} ${chalk.dim('# Start the development server')}

${chalk.bold('Documentation:')}
  https://clyra.vercel.app/docs
`);
}