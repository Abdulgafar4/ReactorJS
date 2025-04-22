// cli/generate.js - Component generation

import fs from 'fs';
import path from 'path';

/**
 * Generate a new component, page, or layout
 * @param {string[]} args - CLI arguments
 */
export function generateComponent(args) {
  const type = args[0];
  const name = args[1];
  
  if (!type || !name) {
    console.error('Error: Please provide a type and name');
    console.log('Example: clyra generate component Button');
    process.exit(1);
  }
  
  // Validate type
  const validTypes = ['component', 'page', 'layout', 'hook', 'util', 'api'];
  if (!validTypes.includes(type)) {
    console.error(`Error: Invalid type "${type}". Must be one of: ${validTypes.join(', ')}`);
    process.exit(1);
  }
  
  console.log(`Generating ${type} ${name}...`);
  
  // Detect project settings
  const projectSettings = detectProjectSettings();
  
  // Generate the file
  try {
    const filePath = generateFile(type, name, projectSettings);
    console.log(`✅ Generated ${type} at: ${filePath}`);
  } catch (error) {
    console.error(`Error generating ${type}:`, error.message);
    process.exit(1);
  }
}

/**
 * Detect project settings (TypeScript, Tailwind, etc.)
 * @returns {Object} Project settings
 */
function detectProjectSettings() {
  const cwd = process.cwd();
  const settings = {
    useTypeScript: false,
    useTailwind: false,
    useShadcn: false
  };
  
  // Check for TypeScript
  if (
    fs.existsSync(path.join(cwd, 'tsconfig.json')) ||
    fs.existsSync(path.join(cwd, 'clyra.config.ts'))
  ) {
    settings.useTypeScript = true;
  }
  
  // Check for Tailwind
  if (fs.existsSync(path.join(cwd, 'tailwind.config.js'))) {
    settings.useTailwind = true;
  }
  
  // Check for shadcn/ui (look for dependencies in package.json)
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8')
    );
    
    if (
      (packageJson.dependencies && packageJson.dependencies['clyra-ui']) ||
      (packageJson.dependencies && packageJson.dependencies['clyra-styling'])
    ) {
      settings.useShadcn = true;
    }
  } catch (error) {
    // Ignore package.json errors
  }
  
  console.log('Detected project settings:');
  console.log(`- TypeScript: ${settings.useTypeScript ? 'Yes' : 'No'}`);
  console.log(`- Tailwind CSS: ${settings.useTailwind ? 'Yes' : 'No'}`);
  console.log(`- shadcn/ui: ${settings.useShadcn ? 'Yes' : 'No'}`);
  
  return settings;
}

/**
 * Generate a file based on type and settings
 * @param {string} type - File type (component, page, layout, etc.)
 * @param {string} name - Component name
 * @param {Object} settings - Project settings
 * @returns {string} Generated file path
 */
function generateFile(type, name, settings) {
  const cwd = process.cwd();
  const ext = settings.useTypeScript ? 'tsx' : 'jsx';
  
  // Format the name (PascalCase for components, kebab-case for files)
  const pascalCaseName = toPascalCase(name);
  const kebabCaseName = toKebabCase(name);
  
  // Determine file path based on type
  let basePath;
  let template;
  
  switch (type) {
    case 'component':
      basePath = path.join(cwd, 'src', 'app', 'components');
      template = generateComponentTemplate(pascalCaseName, settings);
      break;
    case 'page':
      basePath = path.join(cwd, 'src', 'app', 'pages');
      template = generatePageTemplate(pascalCaseName, settings);
      break;
    case 'layout':
      basePath = path.join(cwd, 'src', 'app', 'layouts');
      template = generateLayoutTemplate(pascalCaseName, settings);
      break;
    case 'hook':
      basePath = path.join(cwd, 'src', 'app', 'hooks');
      template = generateHookTemplate(pascalCaseName, settings);
      break;
    case 'util':
      basePath = path.join(cwd, 'src', 'app', 'utils');
      template = generateUtilTemplate(pascalCaseName, settings);
      break;
    case 'api':
      basePath = path.join(cwd, 'src', 'app', 'api');
      template = generateApiTemplate(pascalCaseName, settings);
      break;
    default:
      throw new Error(`Invalid type: ${type}`);
  }
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }
  
  // Write file
  const filePath = path.join(basePath, `${kebabCaseName}.${ext}`);
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    throw new Error(`File already exists: ${filePath}`);
  }
  
  fs.writeFileSync(filePath, template);
  
  return filePath;
}

/**
 * Generate component template
 * @param {string} name - Component name
 * @param {Object} settings - Project settings
 * @returns {string} Component template
 */
function generateComponentTemplate(name, settings) {
  const { useTypeScript, useTailwind, useShadcn } = settings;
  
  let imports = [`import Clyra from 'clyra';`];
  
  if (useShadcn) {
    imports.push(`import { ui } from 'clyra-styling';`);
  }
  
  const typescript = useTypeScript ? `
interface ${name}Props {
  children?: React.ReactNode;
  className?: string;
}
` : '';
  
  return `${imports.join('\n')}
${typescript}
const ${name} = ({ children, className = '' }${useTypeScript ? `: ${name}Props` : ''}) => {
  return (
    <div${useTailwind ? ` className={className}` : ''}>
      {children}
    </div>
  );
};

export default ${name};
`;
}

/**
 * Generate page template
 * @param {string} name - Page name
 * @param {Object} settings - Project settings 
 * @returns {string} Page template
 */
function generatePageTemplate(name, settings) {
  const { useTypeScript, useTailwind, useShadcn } = settings;
  
  let imports = [`import Clyra from 'clyra';`];
  
  if (useShadcn) {
    imports.push(`import { ui } from 'clyra-styling';`);
  }
  
  const typescript = useTypeScript ? `
interface ${name}Props {
  params?: Record<string, string>;
  query?: Record<string, string>;
}
` : '';
  
  return `${imports.join('\n')}
${typescript}
const ${name} = (props${useTypeScript ? `: ${name}Props` : ''}) => {
  return (
    <div${useTailwind ? ` className="container mx-auto p-4"` : ''}>
      <h1${useTailwind ? ` className="text-2xl font-bold mb-4"` : ''}>
        ${name.replace(/([A-Z])/g, ' $1').trim()} Page
      </h1>
      <p>This is the ${name.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} page.</p>
    </div>
  );
};

// Uncomment to add server-side data fetching
/*
${name}.getInitialProps = async ({ params, query }) => {
  // Fetch data from API
  return {
    // your data here
  };
};
*/

export default ${name};
`;
}

/**
 * Generate layout template
 * @param {string} name - Layout name 
 * @param {Object} settings - Project settings
 * @returns {string} Layout template
 */
function generateLayoutTemplate(name, settings) {
  const { useTypeScript, useTailwind, useShadcn } = settings;
  
  let imports = [`import Clyra from 'clyra';`];
  
  if (useShadcn) {
    imports.push(`import { ui } from 'clyra-styling';`);
  }
  
  const typescript = useTypeScript ? `
interface ${name}Props {
  children: React.ReactNode;
}
` : '';
  
  return `${imports.join('\n')}
${typescript}
const ${name} = ({ children }${useTypeScript ? `: ${name}Props` : ''}) => {
  return (
    <div${useTailwind ? ` className="min-h-screen flex flex-col"` : ''}>
      <header${useTailwind ? ` className="bg-primary text-white p-4"` : ''}>
        <h1${useTailwind ? ` className="text-xl font-bold"` : ''}>
          ${name.replace(/([A-Z])/g, ' $1').trim()}
        </h1>
      </header>
      
      <main${useTailwind ? ` className="flex-1 p-4"` : ''}>
        {children}
      </main>
      
      <footer${useTailwind ? ` className="bg-gray-100 p-4 text-center text-gray-600"` : ''}>
        <p>© ${new Date().getFullYear()} Your Company</p>
      </footer>
    </div>
  );
};

export default ${name};
`;
}

/**
 * Generate hook template
 * @param {string} name - Hook name
 * @param {Object} settings - Project settings
 * @returns {string} Hook template
 */
function generateHookTemplate(name, settings) {
  const { useTypeScript } = settings;
  const hookName = `use${name}`;
  
  return `import Clyra from 'clyra';

/**
 * ${name} hook
 * ${useTypeScript ? '@returns {[any, (value: any) => void]}' : ''}
 */
function ${hookName}(${useTypeScript ? 'initialValue?: any' : 'initialValue'}) {
  const [value, setValue] = Clyra.useState(initialValue);
  
  // Your hook logic here
  
  return [value, setValue];
}

export default ${hookName};
`;
}

/**
 * Generate utility function template
 * @param {string} name - Utility name
 * @param {Object} settings - Project settings
 * @returns {string} Utility template
 */
function generateUtilTemplate(name, settings) {
  const { useTypeScript } = settings;
  const functionName = toCamelCase(name);
  
  return `/**
 * ${name} utility function
 * ${useTypeScript ? '@param {any} input - Input value\n * @returns {any} - Processed value' : ''}
 */
function ${functionName}(${useTypeScript ? 'input: any' : 'input'})${useTypeScript ? ': any' : ''} {
  // Your utility logic here
  return input;
}

export default ${functionName};
`;
}

/**
 * Generate API route template
 * @param {string} name - API route name
 * @param {Object} settings - Project settings
 * @returns {string} API route template
 */
function generateApiTemplate(name, settings) {
  const { useTypeScript } = settings;
  const routeName = toCamelCase(name);
  
  return `/**
 * ${name} API route handler
 * ${useTypeScript ? '@param {Request} req - The request object\n * @param {Response} res - The response object' : ''}
 */
function ${routeName}(${useTypeScript ? 'req: Request, res: Response' : 'req, res'}) {
  const { method } = req;
  
  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.status(405).json({ error: 'Method Not Allowed' });
  }
}

/**
 * Handle GET request
 */
function handleGet(${useTypeScript ? 'req: Request, res: Response' : 'req, res'}) {
  res.status(200).json({ message: 'GET request successful' });
}

/**
 * Handle POST request
 */
function handlePost(${useTypeScript ? 'req: Request, res: Response' : 'req, res'}) {
  res.status(201).json({ message: 'POST request successful' });
}

/**
 * Handle PUT request
 */
function handlePut(${useTypeScript ? 'req: Request, res: Response' : 'req, res'}) {
  res.status(200).json({ message: 'PUT request successful' });
}

/**
 * Handle DELETE request
 */
function handleDelete(${useTypeScript ? 'req: Request, res: Response' : 'req, res'}) {
  res.status(200).json({ message: 'DELETE request successful' });
}

export default ${routeName};
`;
}

// ---- Helper functions for name formatting ----

/**
 * Convert string to PascalCase
 * @param {string} str - Input string
 * @returns {string} PascalCase string
 */
function toPascalCase(str) {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Convert string to camelCase
 * @param {string} str - Input string
 * @returns {string} camelCase string
 */
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert string to kebab-case
 * @param {string} str - Input string
 * @returns {string} kebab-case string
 */
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
