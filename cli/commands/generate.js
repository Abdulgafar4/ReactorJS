// cli/commands/generate.js - File generator for components, pages, etc.

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { ensureClyraProject } from '../utils/helpers.js';

// Template content for different file types
const templates = {
  component: {
    js: `import React from 'react';

export default function {{name}}({ children }) {
  return (
    <div className="{{name}}">
      {children}
    </div>
  );
}
`,
    ts: `import React from 'react';

interface {{name}}Props {
  children?: React.ReactNode;
}

export default function {{name}}({ children }: {{name}}Props) {
  return (
    <div className="{{name}}">
      {children}
    </div>
  );
}
`
  },
  page: {
    js: `import React from 'react';

export default function {{name}}Page() {
  return (
    <div>
      <h1>{{name}}</h1>
      <p>This is the {{name}} page.</p>
    </div>
  );
}
`,
    ts: `import React from 'react';

export default function {{name}}Page() {
  return (
    <div>
      <h1>{{name}}</h1>
      <p>This is the {{name}} page.</p>
    </div>
  );
}
`
  },
  layout: {
    js: `import React from 'react';

export default function {{name}}Layout({ children }) {
  return (
    <div className="layout {{kebabName}}">
      <main>{children}</main>
    </div>
  );
}
`,
    ts: `import React from 'react';

interface {{name}}LayoutProps {
  children: React.ReactNode;
}

export default function {{name}}Layout({ children }: {{name}}LayoutProps) {
  return (
    <div className="layout {{kebabName}}">
      <main>{children}</main>
    </div>
  );
}
`
  },
  screen: {
    js: `import React from 'react';
import { View, Text } from 'clyra';

export default function {{name}}Screen() {
  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold">{{name}} Screen</Text>
      <Text>This is the {{name}} screen.</Text>
    </View>
  );
}
`,
    ts: `import React from 'react';
import { View, Text } from 'clyra';

export default function {{name}}Screen() {
  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold">{{name}} Screen</Text>
      <Text>This is the {{name}} screen.</Text>
    </View>
  );
}
`
  },
  hook: {
    js: `import { useState, useEffect } from 'react';

export function use{{name}}() {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Your effect code here
  }, []);
  
  return state;
}
`,
    ts: `import { useState, useEffect } from 'react';

export function use{{name}}<T = any>(): T | null {
  const [state, setState] = useState<T | null>(null);
  
  useEffect(() => {
    // Your effect code here
  }, []);
  
  return state;
}
`
  }
};

/**
 * Generates files based on type and name
 * @param {string} type - Type of file to generate (component, page, layout, screen, hook)
 * @param {string} name - Name of the file
 * @param {Object} options - Generation options
 */
export function generateFiles(type, name, options = {}) {
  // Make sure we're in a Clyra project
  ensureClyraProject();
  
  // Validate type
  if (!Object.keys(templates).includes(type)) {
    console.error(chalk.red(`Error: Invalid file type "${type}"`));
    console.error(`Available types: ${Object.keys(templates).join(', ')}`);
    process.exit(1);
  }
  
  // Validate name
  if (!name) {
    console.error(chalk.red('Error: Name is required'));
    process.exit(1);
  }
  
  // Format name (PascalCase)
  const formattedName = formatName(name);
  const kebabCaseName = kebabCase(name);
  
  // Determine file extension
  const isTypeScript = options.typescript || false;
  const fileExt = isTypeScript ? 'tsx' : 'jsx';
  const templateType = isTypeScript ? 'ts' : 'js';
  
  // Determine target directory
  const baseDir = process.cwd();
  
  let targetDir;
  switch (type) {
    case 'component':
      targetDir = options.dir || 
        (options.platform === 'native' ? 'src/native/components' : 'src/app/components');
      break;
    case 'page':
      targetDir = options.dir || 'src/app/pages';
      break;
    case 'layout':
      targetDir = options.dir || 'src/app/layouts';
      break;
    case 'screen':
      targetDir = options.dir || 'src/native/screens';
      break;
    case 'hook':
      targetDir = options.dir || 'src/hooks';
      break;
    default:
      targetDir = options.dir || 'src';
  }
  
  // Create full path
  const fullDir = path.join(baseDir, targetDir);
  
  // Create directory if it doesn't exist
  fs.ensureDirSync(fullDir);
  
  // Create file name
  let fileName = formattedName;
  
  // Add suffix if needed
  if (type === 'page') fileName += 'Page';
  if (type === 'layout') fileName += 'Layout';
  if (type === 'screen') fileName += 'Screen';
  
  // Full file path
  const filePath = path.join(fullDir, `${fileName}.${fileExt}`);
  
  // Check if file already exists
  if (fs.existsSync(filePath) && !options.force) {
    console.error(chalk.red(`Error: File already exists at ${filePath}`));
    console.error('Use --force to overwrite');
    process.exit(1);
  }
  
  // Get template content
  let content = templates[type][templateType] || '';
  
  // Replace placeholders
  content = content
    .replace(/{{name}}/g, formattedName)
    .replace(/{{kebabName}}/g, kebabCaseName);
  
  // Write the file
  try {
    fs.writeFileSync(filePath, content);
    
    console.log(chalk.green(`✅ Generated ${type}: ${chalk.cyan(filePath)}`));
    
    // Additional info for specific types
    if (type === 'page') {
      console.log(chalk.yellow('\nTo use this page, add a route in your application:'));
      console.log(`import ${fileName} from '${path.relative('src', path.join(targetDir, fileName))}';\n`);
      console.log(`// Add to your routes configuration`);
      console.log(`'/${kebabCaseName}': ${fileName},`);
    }
    
    if (type === 'component') {
      console.log(chalk.yellow('\nTo use this component:'));
      console.log(`import ${fileName} from '${path.relative('src', path.join(targetDir, fileName))}';\n`);
      console.log(`// Then in your JSX`);
      console.log(`<${fileName}>Content</${fileName}>`);
    }
    
  } catch (error) {
    console.error(chalk.red(`Error creating file: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Formats a name to PascalCase
 * @param {string} name - The input name
 * @returns {string} PascalCase name
 */
function formatName(name) {
  return name
    .split(/[-_\s.]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Converts a name to kebab-case
 * @param {string} name - The input name
 * @returns {string} kebab-case name
 */
function kebabCase(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}