// cli/create-app.js - Project scaffolding

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

/**
 * Create interface for command-line input
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Create a new ReactorJS project
 * @param {string[]} args - CLI arguments
 */
function createNewProject(args) {
  const projectName = args[0];
  
  if (!projectName) {
    console.error('Error: Please provide a project name');
    console.log('Example: reactorjs create my-app');
    process.exit(1);
  }
  
  const projectDir = path.resolve(process.cwd(), projectName);
  
  // Check if directory already exists
  if (fs.existsSync(projectDir)) {
    console.error(`Error: Directory ${projectName} already exists`);
    process.exit(1);
  }
  
  console.log(`Creating a new ReactorJS project in ${projectDir}...`);
  
  // Create project directory
  fs.mkdirSync(projectDir, { recursive: true });
  
  // Ask for project configuration
  const rl = createReadlineInterface();
  
  rl.question('What platforms do you want to target? (web, native, both) [both]: ', (platforms) => {
    platforms = platforms.toLowerCase() || 'both';
    
    rl.question('Do you want to include Tailwind CSS? (y/n) [y]: ', (includeTailwind) => {
      includeTailwind = includeTailwind.toLowerCase() !== 'n';
      
      rl.question('Do you want to include shadcn/ui components? (y/n) [y]: ', (includeShadcn) => {
        includeShadcn = includeShadcn.toLowerCase() !== 'n';
        
        rl.question('Do you want to use TypeScript? (y/n) [y]: ', (useTypeScript) => {
          useTypeScript = useTypeScript.toLowerCase() !== 'n';
          
          // Create project files
          createProjectStructure(projectDir, {
            platforms,
            includeTailwind,
            includeShadcn,
            useTypeScript
          });
          
          rl.close();
        });
      });
    });
  });
}

/**
 * Create project directory structure and files
 * @param {string} projectDir - Project directory path
 * @param {Object} options - Project options
 */
function createProjectStructure(projectDir, options) {
  const { platforms, includeTailwind, includeShadcn, useTypeScript } = options;
  const ext = useTypeScript ? 'ts' : 'js';
  const jsxExt = useTypeScript ? 'tsx' : 'jsx';
  
  // Create package.json
  const packageJson = {
    name: path.basename(projectDir),
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'reactorjs dev',
      build: 'reactorjs build',
      start: 'reactorjs start',
      lint: useTypeScript ? 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0' : 'eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0'
    },
    dependencies: {
      'reactorjs': '^0.1.0',
      'reactorjs-router': '^0.1.0',
      'reactorjs-styling': '^0.1.0'
    },
    devDependencies: {
      'reactorjs-cli': '^0.1.0'
    }
  };
  
  // Add TypeScript dependencies if needed
  if (useTypeScript) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      'typescript': '^5.0.0',
      '@types/node': '^20.0.0'
    };
  }
  
  // Add platform-specific dependencies
  if (platforms === 'native' || platforms === 'both') {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      'reactorjs-native': '^0.1.0'
    };
  }
  
  // Add styling dependencies
  if (includeTailwind) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      'tailwindcss': '^3.3.0',
      'postcss': '^8.4.0',
      'autoprefixer': '^10.4.0'
    };
  }
  
  if (includeShadcn) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      'reactorjs-ui': '^0.1.0'
    };
  }
  
  // Write package.json
  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create directory structure
  const dirs = [
    'src',
    'src/app',
    'src/app/pages',
    'src/app/layouts',
    'src/app/components',
    'src/styles',
    'public'
  ];
  
  if (platforms === 'native' || platforms === 'both') {
    dirs.push('src/native');
    dirs.push('src/native/screens');
    dirs.push('src/native/components');
  }
  
  dirs.forEach(dir => {
    fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
  });
  
  // Create configuration files
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
      include: ['reactorjs.config.ts']
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
  
  // Create ReactorJS configuration file
  const reactorConfig = `// ReactorJS Configuration
${useTypeScript ? 'export default ' : 'module.exports = '}({
  // General settings
  appName: '${path.basename(projectDir)}',
  
  // Platforms to build for
  platforms: ['${platforms === 'both' ? 'web", "native' : platforms}'],
  
  // Web configuration
  web: {
    devPort: 3000,
    buildDir: 'dist',
    publicDir: 'public',
  },
  
  // Native configuration
  native: {
    appId: 'com.example.${path.basename(projectDir)}',
    platforms: ['ios', 'android'],
  },
  
  // Styling options
  styling: {
    tailwind: ${includeTailwind},
    shadcn: ${includeShadcn},
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
    path.join(projectDir, `reactorjs.config.${ext}`),
    reactorConfig
  );
  
  // Create Tailwind configuration if needed
  if (includeTailwind) {
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
${useTypeScript ? 'export default ' : 'module.exports = '}({
  content: [
    "./src/**/*.{${jsxExt},${ext},html}",
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
});
`;
    
    fs.writeFileSync(
      path.join(projectDir, 'tailwind.config.js'),
      tailwindConfig
    );
    
    // Create PostCSS config
    const postcssConfig = `module.exports = {
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
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;
    
    fs.writeFileSync(
      path.join(projectDir, 'src/styles/globals.css'),
      globalCss
    );
  }
  
  // Create main entry files
  createEntryFiles(projectDir, options);
  
  // Create sample pages and components
  createSampleFiles(projectDir, options);
  
  // Initialize git repository
  try {
    execSync('git init', { cwd: projectDir, stdio: 'ignore' });
    fs.writeFileSync(
      path.join(projectDir, '.gitignore'),
      `# ReactorJS generated gitignore
node_modules
dist
.env
.env.local

# Native
ios/Pods
android/build
android/app/build

# Editor
.vscode
.idea
*.log
`
    );
    
    // First commit
    execSync('git add .', { cwd: projectDir, stdio: 'ignore' });
    execSync('git commit -m "Initial commit from ReactorJS CLI"', { cwd: projectDir, stdio: 'ignore' });
  } catch (error) {
    console.warn('Git initialization failed. You can manually initialize the repository later.');
  }
  
  console.log(`
✅ ReactorJS project created successfully!

To get started:
  cd ${path.basename(projectDir)}
  npm install
  npm run dev

For more information, check out the README.md file in your project.
  `);
}

/**
 * Create entry files for web and native platforms
 * @param {string} projectDir - Project directory path 
 * @param {Object} options - Project options
 */
function createEntryFiles(projectDir, options) {
  const { platforms, includeTailwind, includeShadcn, useTypeScript } = options;
  const ext = useTypeScript ? 'ts' : 'js';
  const jsxExt = useTypeScript ? 'tsx' : 'jsx';
  
  // Create web entry file
  if (platforms === 'web' || platforms === 'both') {
    const webEntryImports = [
      `import ReactorJS from 'reactorjs';`,
      `import RouterComponents from 'reactorjs-router';`
    ];
    
    if (includeTailwind) {
      webEntryImports.push(`import './styles/globals.css';`);
    }
    
    if (includeShadcn) {
      webEntryImports.push(`import { ui, TailwindProvider } from 'reactorjs-styling';`);
    }
    
    const webEntryContent = `${webEntryImports.join('\n')}

const { hydrate } = RouterComponents;

// Import pages
import HomePage from './app/pages/home.${jsxExt}';
import AboutPage from './app/pages/about.${jsxExt}';

// Import layouts
import MainLayout from './app/layouts/main.${jsxExt}';

// Define routes
const pages = {
  '/': HomePage,
  '/about': AboutPage
};

// Define layouts
const layouts = {
  '/': MainLayout
};

// Initialize the app
const app = hydrate({
  container: document.getElementById('root'),
  pages,
  layouts,
  ${includeShadcn ? `
  // Wrap with UI providers
  wrapper: (children) => (
    ${includeTailwind ? `<TailwindProvider>
      <ui.ThemeProvider theme="light">
        {children}
      </ui.ThemeProvider>
    </TailwindProvider>` : `<ui.ThemeProvider theme="light">
      {children}
    </ui.ThemeProvider>`}
  ),` : ''}
});

export default app;
`;
    
    fs.writeFileSync(
      path.join(projectDir, `src/index.${jsxExt}`),
      webEntryContent
    );
    
    // Create HTML template
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${path.basename(projectDir)}</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/index.${jsxExt}"></script>
</body>
</html>`;
    
    fs.writeFileSync(
      path.join(projectDir, 'index.html'),
      htmlTemplate
    );
  }
  
  // Create native entry file
  if (platforms === 'native' || platforms === 'both') {
    const nativeEntryImports = [
      `import ReactorJS from 'reactorjs';`,
      `import { AppRegistry } from 'reactorjs-native';`
    ];
    
    if (includeTailwind || includeShadcn) {
      nativeEntryImports.push(`import { reactorNative, ${includeShadcn ? 'ui, ' : ''}TailwindProvider } from 'reactorjs-styling';`);
    }
    
    const nativeEntryContent = `${nativeEntryImports.join('\n')}

// Import screens
import HomeScreen from './native/screens/home.${jsxExt}';
import AboutScreen from './native/screens/about.${jsxExt}';

// Define app structure
const App = () => {
  return (
    ${includeTailwind || includeShadcn ? `<TailwindProvider>
      ${includeShadcn ? `<ui.ThemeProvider theme="light">` : ''}` : ''}
      <reactorNative.View className="flex-1 bg-white">
        <HomeScreen />
      </reactorNative.View>
    ${includeShadcn ? `</ui.ThemeProvider>` : ''}
    ${includeTailwind || includeShadcn ? `</TailwindProvider>` : ''}
  );
};

// Register the app
AppRegistry.registerComponent('${path.basename(projectDir)}', () => App);

export default App;
`;
    
    fs.writeFileSync(
      path.join(projectDir, `src/native/index.${jsxExt}`),
      nativeEntryContent
    );
  }
}

module.exports = {
  createNewProject
};