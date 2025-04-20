// cli/sample-files.js - Generate sample project files

const fs = require('fs');
const path = require('path');

/**
 * Create sample pages, layouts, and components for the new project
 * @param {string} projectDir - Project directory path
 * @param {Object} options - Project options
 */
function createSampleFiles(projectDir, options) {
  const { platforms, includeTailwind, includeShadcn, useTypeScript } = options;
  const ext = useTypeScript ? 'ts' : 'js';
  const jsxExt = useTypeScript ? 'tsx' : 'jsx';
  
  // Ensure project directory structure exists
  const createDirectoryIfNotExists = (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };

  // Create necessary directories
  createDirectoryIfNotExists(path.join(projectDir, 'src/app/components'));
  createDirectoryIfNotExists(path.join(projectDir, 'src/app/layouts'));
  createDirectoryIfNotExists(path.join(projectDir, 'src/app/pages'));
  
  if (platforms === 'native' || platforms === 'both') {
    createDirectoryIfNotExists(path.join(projectDir, 'src/native/screens'));
  }

  // Create sample component
  const buttonComponent = `import ReactorJS from 'reactorjs';
${includeShadcn ? `import { ui } from 'reactorjs-styling';` : ''}

${useTypeScript ? `interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}` : ''}

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  className = '' 
}${useTypeScript ? ': ButtonProps' : ''}) => {
  ${includeShadcn ? `return (
    <ui.Button 
      onClick={onClick}
      variant={variant === 'primary' ? 'default' : variant === 'secondary' ? 'secondary' : 'outline'}
      size={size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'default'}
      className={className}
    >
      {children}
    </ui.Button>
  );` : `const baseClasses = 'rounded font-medium transition-colors';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50'
  };
  
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  const combinedClasses = \`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${className}\`;
  
  return (
    <button className={combinedClasses} onClick={onClick}>
      {children}
    </button>
  );`}
};

export default Button;
`;
  
  fs.writeFileSync(
    path.join(projectDir, `src/app/components/button.${jsxExt}`),
    buttonComponent
  );
  
  // Create main layout
  const mainLayout = `import ReactorJS from 'reactorjs';
import RouterComponents from 'reactorjs-router';

const { Link } = RouterComponents;

${useTypeScript ? `interface MainLayoutProps {
  children: React.ReactNode;
}` : ''}

const MainLayout = ({ children }${useTypeScript ? ': MainLayoutProps' : ''}) => {
  return (
    <div${includeTailwind ? ` className="min-h-screen flex flex-col"` : ''}>
      <header${includeTailwind ? ` className="bg-primary text-white p-4"` : ''}>
        <nav${includeTailwind ? ` className="flex gap-4"` : ''}>
          <Link href="/"${includeTailwind ? ` className="hover:underline"` : ''}>Home</Link>
          <Link href="/about"${includeTailwind ? ` className="hover:underline"` : ''}>About</Link>
        </nav>
      </header>
      <main${includeTailwind ? ` className="flex-1 p-4"` : ''}>
        {children}
      </main>
      <footer${includeTailwind ? ` className="bg-gray-100 p-4 text-center"` : ''}>
        <p>Built with ReactorJS</p>
      </footer>
    </div>
  );
};

export default MainLayout;
`;
  
  fs.writeFileSync(
    path.join(projectDir, `src/app/layouts/main.${jsxExt}`),
    mainLayout
  );
  
  // Create home page
  const homePage = `import ReactorJS from 'reactorjs';
import Button from '../components/button.${jsxExt}';

${useTypeScript ? `interface HomePageProps {
  params?: Record<string, string>;
  query?: Record<string, string>;
}` : ''}

class HomePage extends ReactorJS.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }
  
  // Server-side data fetching (similar to Next.js)
  static async getInitialProps({ params, query }) {
    // This would typically fetch data from an API
    return {
      serverData: {
        message: 'Hello from the server!'
      }
    };
  }
  
  incrementCounter = () => {
    this.setState({ counter: this.state.counter + 1 });
  }
  
  render() {
    const { serverData } = this.props;
    const { counter } = this.state;
    
    return (
      <div${includeTailwind ? ` className="max-w-4xl mx-auto"` : ''}>
        <h1${includeTailwind ? ` className="text-3xl font-bold mb-6"` : ''}>Welcome to ReactorJS</h1>
        
        ${includeTailwind ? `<div className="bg-white rounded-lg shadow p-6 mb-6">` : '<div>'}
          <p${includeTailwind ? ` className="mb-4"` : ''}>
            Server message: {serverData?.message}
          </p>
          
          <p${includeTailwind ? ` className="mb-4"` : ''}>Counter: {counter}</p>
          
          <Button 
            onClick={this.incrementCounter}
            variant="primary"
            ${includeTailwind ? `className="mr-2"` : ''}
          >
            Increment
          </Button>
          
          <Button 
            variant="outline"
          >
            Reset
          </Button>
        </div>
        
        ${includeTailwind ? `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Features</h2>
            <ul className="list-disc pl-5">
              <li>Virtual DOM with efficient diffing</li>
              <li>Server-side rendering</li>
              <li>File-based routing</li>
              <li>Component system with lifecycle methods</li>
              <li>Hooks for functional components</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
            <p>Edit <code className="bg-gray-100 px-1 py-0.5 rounded">src/app/pages/home.${jsxExt}</code> to get started.</p>
          </div>
        </div>` : `<div>
          <h2>Features</h2>
          <ul>
            <li>Virtual DOM with efficient diffing</li>
            <li>Server-side rendering</li>
            <li>File-based routing</li>
            <li>Component system with lifecycle methods</li>
            <li>Hooks for functional components</li>
          </ul>
          
          <h2>Getting Started</h2>
          <p>Edit <code>src/app/pages/home.${jsxExt}</code> to get started.</p>
        </div>`}
      </div>
    );
  }
}

export default HomePage;
`;
  
  fs.writeFileSync(
    path.join(projectDir, `src/app/pages/home.${jsxExt}`),
    homePage
  );
  
  // Create about page
  const aboutPage = `import ReactorJS from 'reactorjs';
const { useState, useEffect } = ReactorJS;

const AboutPage = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setData(['ReactorJS', 'Tailwind CSS', 'shadcn/ui', 'React Native']);
    }, 1000);
  }, []);
  
  return (
    <div${includeTailwind ? ` className="max-w-4xl mx-auto"` : ''}>
      <h1${includeTailwind ? ` className="text-3xl font-bold mb-6"` : ''}>About ReactorJS</h1>
      
      <p${includeTailwind ? ` className="mb-4"` : ''}>
        ReactorJS is a comprehensive JavaScript framework that combines the best features 
        from React, Next.js, Vue.js, and Angular with built-in support for Tailwind CSS, 
        shadcn/ui components, and React Native compatibility.
      </p>
      
      <h2${includeTailwind ? ` className="text-2xl font-semibold mt-6 mb-4"` : ''}>Technologies Used</h2>
      
      {data.length > 0 ? (
        <ul${includeTailwind ? ` className="list-disc pl-5"` : ''}>
          {data.map((item, index) => (
            <li key={index}${includeTailwind ? ` className="mb-1"` : ''}>{item}</li>
          ))}
        </ul>
      ) : (
        <p${includeTailwind ? ` className="italic"` : ''}>Loading data...</p>
      )}
    </div>
  );
};

export default AboutPage;
`;
  
  fs.writeFileSync(
    path.join(projectDir, `src/app/pages/about.${jsxExt}`),
    aboutPage
  );
  
  // Create React Native screens
  if (platforms === 'native' || platforms === 'both') {
    const homeScreen = `import ReactorJS from 'reactorjs';
import { reactorNative } from 'reactorjs-styling';

const { View, Text, TouchableOpacity } = reactorNative;

const HomeScreen = () => {
  const [count, setCount] = ReactorJS.useState(0);
  
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold mb-6">ReactorJS Native</Text>
      
      <Text className="text-lg mb-4">Count: {count}</Text>
      
      <View className="flex-row space-x-4">
        <TouchableOpacity 
          className="bg-primary px-4 py-2 rounded"
          onPress={() => setCount(count + 1)}
        >
          <Text className="text-white font-medium">Increment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-secondary px-4 py-2 rounded"
          onPress={() => setCount(0)}
        >
          <Text className="text-white font-medium">Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
`;
    
    fs.writeFileSync(
      path.join(projectDir, `src/native/screens/home.${jsxExt}`),
      homeScreen
    );
    
    const aboutScreen = `import ReactorJS from 'reactorjs';
import { reactorNative } from 'reactorjs-styling';

const { View, Text, ScrollView } = reactorNative;

const AboutScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">About ReactorJS Native</Text>
      
      <Text className="mb-4">
        ReactorJS Native allows you to build native mobile applications using the same 
        components and patterns as your web application.
      </Text>
      
      <Text className="text-xl font-semibold mt-4 mb-2">Features</Text>
      
      <View className="ml-4">
        <Text className="mb-2">• Cross-platform components</Text>
        <Text className="mb-2">• Tailwind CSS support</Text>
        <Text className="mb-2">• Consistent API with web</Text>
        <Text className="mb-2">• Native performance</Text>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;
`;
    
    fs.writeFileSync(
      path.join(projectDir, `src/native/screens/about.${jsxExt}`),
      aboutScreen
    );
  }
  
  // Create README.md
  const readme = `# ${path.basename(projectDir)}

A project built with ReactorJS - the comprehensive JavaScript framework.

## Features

- **Virtual DOM**: Efficient rendering with intelligent diffing
- **Component System**: Both class and function components with hooks
- **Server-Side Rendering**: Improved SEO and performance
- **File-Based Routing**: Simplified navigation structure
- **Styling Solutions**: ${includeTailwind ? 'Built-in Tailwind CSS' : 'Custom styling'} ${includeShadcn ? 'and shadcn/ui components' : ''}
- ${platforms === 'both' ? '**Cross-Platform**: Web and mobile from a single codebase' : platforms === 'native' ? '**Native**: Mobile-first application development' : '**Web-Focused**: Optimized for web applications'}

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
\`\`\`

## Project Structure

\`\`\`
${path.basename(projectDir)}/
├── src/                # Source code
│   ├── app/            # Web application
│   │   ├── components/ # Reusable components
│   │   ├── layouts/    # Page layouts
│   │   └── pages/      # Page components${platforms === 'native' || platforms === 'both' ? `
│   ├── native/         # Native application
│   │   ├── components/ # Native components
│   │   └── screens/    # Native screens` : ''}
│   └── styles/         # Global styles
├── public/             # Static assets
├── reactorjs.config.js # Framework configuration
${includeTailwind ? '├── tailwind.config.js  # Tailwind CSS configuration\n' : ''}└── package.json        # Project dependencies
\`\`\`

## Documentation

For more information on how to use ReactorJS, check out the [official documentation](https://reactorjs.dev).

## License

MIT
`;
  
  fs.writeFileSync(
    path.join(projectDir, 'README.md'),
    readme
  );
}

/**
 * Generate CLI for creating sample project files
 * @param {string} projectDir - Project directory path
 * @param {Object} options - Project configuration options
 * @param {string} [options.platforms='web'] - Platforms to generate (web, native, or both)
 * @param {boolean} [options.includeTailwind=false] - Include Tailwind CSS classes
 * @param {boolean} [options.includeShadcn=false] - Include shadcn/ui components
 * @param {boolean} [options.useTypeScript=false] - Use TypeScript
 */
function generateSampleProjectFiles(projectDir, options = {}) {
  // Set default options
  const defaultOptions = {
    platforms: 'web',
    includeTailwind: false,
    includeShadcn: false,
    useTypeScript: false
  };
  
  // Merge provided options with defaults
  const finalOptions = { ...defaultOptions, ...options };
  
  // Validate platforms option
  const validPlatforms = ['web', 'native', 'both'];
  if (!validPlatforms.includes(finalOptions.platforms)) {
    throw new Error(`Invalid platforms option. Must be one of: ${validPlatforms.join(', ')}`);
  }
  
  // Ensure project directory exists
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }
  
  // Create sample files
  createSampleFiles(projectDir, finalOptions);
  
  console.log(`Sample project files generated in ${projectDir}`);
}

module.exports = {
  createSampleFiles,
  generateSampleProjectFiles
};