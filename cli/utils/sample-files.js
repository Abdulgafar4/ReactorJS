// cli/utils/sample-files.js - Sample file generator for new projects

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Creates sample files for a new project
 * @param {string} projectDir - Project directory path
 * @param {Object} options - Project options
 */
export function createSampleFiles(projectDir, options) {
  console.log('Creating sample project files...');
  
  const { platforms, useTypeScript, includeTailwind, includeShadcn } = options;
  const ext = useTypeScript ? 'ts' : 'js';
  const jsxExt = useTypeScript ? 'tsx' : 'jsx';
  
  // Create web sample files if needed
  if (platforms === 'web' || platforms === 'both') {
    createWebSampleFiles(projectDir, jsxExt, includeTailwind, includeShadcn);
  }
  
  // Create native sample files if needed
  if (platforms === 'native' || platforms === 'both') {
    createNativeSampleFiles(projectDir, jsxExt, includeTailwind, includeShadcn);
  }
  
  // Create favicon
  createFaviconFile(projectDir);
  
  console.log(chalk.green('✅ Sample files created successfully'));
}

/**
 * Creates web application sample files
 * @param {string} projectDir - Project directory
 * @param {string} jsxExt - File extension for JSX files
 * @param {boolean} includeTailwind - Whether to include Tailwind
 * @param {boolean} includeShadcn - Whether to include shadcn/ui
 */
function createWebSampleFiles(projectDir, jsxExt, includeTailwind, includeShadcn) {
  console.log('Creating web sample files...');
  
  // Header component
  const headerComponent = `import React from 'react';
import { Link } from 'clyra';

export default function Header() {
  return (
    <header className="p-4 bg-primary text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Clyra App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}`;

  fs.writeFileSync(
    path.join(projectDir, `src/app/components/Header.${jsxExt}`),
    headerComponent
  );
  
  // Footer component
  const footerComponent = `import React from 'react';

export default function Footer() {
  return (
    <footer className="p-4 bg-gray-100 text-center">
      <div className="container mx-auto">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} ${path.basename(projectDir)} - Created with Clyra
        </p>
      </div>
    </footer>
  );
}`;

  fs.writeFileSync(
    path.join(projectDir, `src/app/components/Footer.${jsxExt}`),
    footerComponent
  );
  
  // Main layout
  const mainLayout = `import React from 'react';
import Header from '../components/Header.${jsxExt}';
import Footer from '../components/Footer.${jsxExt}';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}`;

  fs.writeFileSync(
    path.join(projectDir, `src/app/layouts/main.${jsxExt}`),
    mainLayout
  );
  
  // Home page
  const homePage = `import React from 'react';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-primary mb-4">Welcome to Clyra</h1>
        <p className="text-lg mb-4">
          This is a sample Clyra application. Edit the home page to get started.
        </p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
          <ul className="list-disc list-inside space-y-1 text-blue-600">
            <li><a href="https://clyra.vercel.app/docs" target="_blank" rel="noopener noreferrer" className="hover:underline">Documentation</a></li>
            <li><a href="https://github.com/clyra/clyra" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub Repository</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(
    path.join(projectDir, `src/app/pages/home.${jsxExt}`),
    homePage
  );
  
  // About page
  const aboutPage = `import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-primary mb-4">About This App</h1>
        <p className="mb-4">
          This is a sample application built with Clyra, a comprehensive JavaScript framework for building web and native applications.
        </p>
        <p className="mb-4">
          Clyra provides a unified approach to building applications across different platforms, with a focus on developer experience and performance.
        </p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Features</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Cross-platform development</li>
            <li>Modern architecture</li>
            <li>Developer-friendly APIs</li>
            <li>Performance optimizations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(
    path.join(projectDir, `src/app/pages/about.${jsxExt}`),
    aboutPage
  );
}

/**
 * Creates native application sample files
 * @param {string} projectDir - Project directory
 * @param {string} jsxExt - File extension for JSX files
 * @param {boolean} includeTailwind - Whether to include Tailwind
 * @param {boolean} includeShadcn - Whether to include shadcn/ui
 */
/**
 * Creates favicon file
 * @param {string} projectDir - Project directory 
 */
function createFaviconFile(projectDir) {
  // Create favicon
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#3b82f6"/>
  <path d="M8 8 L24 8 L24 12 L16 20 L16 24 L12 24 L12 20 L8 16 Z" fill="white"/>
</svg>`;

  fs.writeFileSync(
    path.join(projectDir, 'public/favicon.svg'),
    faviconSvg
  );
}

function createNativeSampleFiles(projectDir, jsxExt, includeTailwind, includeShadcn) {
  console.log('Creating native sample files...');
  
  // Home screen
  const homeScreen = `import React from 'react';
import { View, Text } from 'clyra';
${includeTailwind ? "import { ClyraStyled } from 'clyra';" : ""}

export default function HomeScreen() {
  return (
    ${includeTailwind ? 
      '<ClyraStyled.View className="flex-1 p-4 bg-white justify-center items-center">' : 
      '<View style={{flex: 1, padding: 16, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>'
    }
      ${includeTailwind ? 
        '<Text className="text-2xl font-bold text-primary mb-4">Welcome to Clyra Native</Text>' : 
        '<Text style={{fontSize: 24, fontWeight: "bold", color: "#3b82f6", marginBottom: 16}}>Welcome to Clyra Native</Text>'
      }
      ${includeTailwind ? 
        '<Text className="text-center">This is a sample native screen. Edit this screen to get started.</Text>' : 
        '<Text style={{textAlign: "center"}}>This is a sample native screen. Edit this screen to get started.</Text>'
      }
    ${includeTailwind ? '</ClyraStyled.View>' : '</View>'}
  );
}`;

  fs.writeFileSync(
    path.join(projectDir, `src/native/screens/home.${jsxExt}`),
    homeScreen
  );
  
  // About screen
  const aboutScreen = `import React from 'react';
import { View, Text } from 'clyra';
${includeTailwind ? "import { ClyraStyled } from 'clyra';" : ""}

export default function AboutScreen() {
  return (
    ${includeTailwind ? 
      '<ClyraStyled.View className="flex-1 p-4 bg-white justify-center items-center">' : 
      '<View style={{flex: 1, padding: 16, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>'
    }
      ${includeTailwind ? 
        '<Text className="text-2xl font-bold text-primary mb-4">About This App</Text>' : 
        '<Text style={{fontSize: 24, fontWeight: "bold", color: "#3b82f6", marginBottom: 16}}>About This App</Text>'
      }
      ${includeTailwind ? 
        '<Text className="text-center mb-4">This is a sample native application built with Clyra.</Text>' : 
        '<Text style={{textAlign: "center", marginBottom: 16}}>This is a sample native application built with Clyra.</Text>'
      }
      ${includeTailwind ? 
        '<Text className="text-center">Clyra provides a unified approach to building applications across different platforms.</Text>' : 
        '<Text style={{textAlign: "center"}}>Clyra provides a unified approach to building applications across different platforms.</Text>'
      }
    ${includeTailwind ? '</ClyraStyled.View>' : '</View>'}
  );
}`;

  fs.writeFileSync(
    path.join(projectDir, `src/native/screens/about.${jsxExt}`),
    aboutScreen
  );
}