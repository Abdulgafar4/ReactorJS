# ReactorJS Framework

ReactorJS is a comprehensive JavaScript framework that combines the best features from React, Next.js, Vue.js, and Angular with built-in support for Tailwind CSS, shadcn/ui components, and React Native compatibility. Build powerful web and mobile applications with a unified, elegant API.

![ReactorJS Framework](https://place-hold.it/800x400?text=ReactorJS&fontsize=32)

## 🌟 Features

### Core Framework
- **Virtual DOM** with efficient diffing algorithm
- **JSX/TSX Support** for declarative UI development
- **Component System** with both class and functional components
- **Hooks API** for stateful functional components
- **Reactive State Management** inspired by Vue.js
- **Context API** for prop drilling prevention

### Routing and Navigation
- **File-based Routing** (Next.js-inspired)
- **Dynamic Routes** with parameters
- **Nested Layouts** for consistent UI structure
- **Client-side Navigation** with history management

### Data Management
- **Server-side Data Fetching** with `getInitialProps`
- **Client-side Data Fetching** with caching
- **Built-in State Management** with Redux-like store
- **Reactive Data** with Vue-inspired reactivity

### Styling Solutions
- **Built-in Tailwind CSS** integration
- **shadcn/ui Components** ready to use
- **Theme System** for consistent design
- **CSS-in-JS** support
- **CSS Modules** for scoped styling

### Server Features
- **Server-side Rendering (SSR)** for improved SEO
- **Static Site Generation (SSG)** for fast loading times
- **API Routes** for backend functionality
- **Incremental Static Regeneration**

### Cross-Platform
- **React Native Integration** for mobile apps
- **Web and Native** from a single codebase
- **Consistent API** across platforms
- **Tailwind for Native** with the same classes

### Developer Experience
- **Hot Module Replacement**
- **TypeScript Support**
- **CLI Tools** for project scaffolding
- **Development Server** with fast refresh

## 🚀 Quick Start

### Create a new ReactorJS project

```bash
# Install the CLI globally
npm install -g reactorjs-cli

# Create a new project
reactorjs create my-app

# Navigate to the project directory
cd my-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── components/  # Reusable components
│   │   ├── layouts/     # Page layouts
│   │   └── pages/       # Page components
│   ├── native/          # Native application
│   │   ├── components/  # Native components
│   │   └── screens/     # Native screens
│   └── styles/          # Global styles
├── public/              # Static assets
├── reactorjs.config.js  # Framework configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Project dependencies
```

## 📚 Examples

### Creating a Component

```jsx
import ReactorJS from 'reactorjs';

// Class Component
class Counter extends ReactorJS.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }
  
  render() {
    return (
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Counter: {this.state.count}</h2>
        <button 
          className="px-4 py-2 bg-primary text-white rounded"
          onClick={this.increment}
        >
          Increment
        </button>
      </div>
    );
  }
}

// Functional Component with Hooks
function CounterWithHooks() {
  const [count, setCount] = ReactorJS.useState(0);
  
  ReactorJS.useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Counter: {count}</h2>
      <button 
        className="px-4 py-2 bg-primary text-white rounded"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
}
```

### Using the Router

```jsx
import ReactorJS from 'reactorjs';
import RouterComponents from 'reactorjs-router';

const { Link } = RouterComponents;

function Navigation() {
  return (
    <nav className="p-4 bg-primary text-white">
      <ul className="flex space-x-4">
        <li><Link href="/" className="hover:underline">Home</Link></li>
        <li><Link href="/about" className="hover:underline">About</Link></li>
        <li><Link href="/users/123" className="hover:underline">User Profile</Link></li>
      </ul>
    </nav>
  );
}

// Dynamic route page (in src/app/pages/users/[id].jsx)
function UserProfile({ params }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p>User ID: {params.id}</p>
    </div>
  );
}

// Server-side data fetching
UserProfile.getInitialProps = async ({ params }) => {
  // Fetch user data from API
  const response = await fetch(`https://api.example.com/users/${params.id}`);
  const userData = await response.json();
  
  return { userData };
};
```

### Using shadcn/ui Components

```jsx
import ReactorJS from 'reactorjs';
import { ui } from 'reactorjs-styling';

function LoginForm() {
  const [email, setEmail] = ReactorJS.useState('');
  const [password, setPassword] = ReactorJS.useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
  };
  
  return (
    <ui.Card className="w-full max-w-md mx-auto">
      <ui.CardHeader>
        <ui.CardTitle>Login</ui.CardTitle>
        <ui.CardDescription>
          Enter your credentials to access your account
        </ui.CardDescription>
      </ui.CardHeader>
      
      <ui.CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <ui.Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <ui.Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </form>
      </ui.CardContent>
      
      <ui.CardFooter>
        <ui.Button type="submit" className="w-full">
          Sign In
        </ui.Button>
      </ui.CardFooter>
    </ui.Card>
  );
}
```

### Creating React Native Screens

```jsx
import ReactorJS from 'reactorjs';
import { reactorNative } from 'reactorjs-styling';

const { View, Text, TouchableOpacity, ScrollView } = reactorNative;

function HomeScreen() {
  const [count, setCount] = ReactorJS.useState(0);
  
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">ReactorJS Native</Text>
      
      <View className="bg-gray-100 rounded-lg p-6 mb-6">
        <Text className="text-lg mb-4">Count: {count}</Text>
        
        <View className="flex-row space-x-4">
          <TouchableOpacity 
            className="bg-primary px-4 py-2 rounded"
            onPress={() => setCount(count + 1)}
          >
            <Text className="text-white font-medium">Increment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-gray-500 px-4 py-2 rounded"
            onPress={() => setCount(0)}
          >
            <Text className="text-white font-medium">Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text className="text-xl font-semibold mb-4">Features</Text>
      <View className="space-y-2 mb-6">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-primary mr-2" />
          <Text>Unified API for web and native</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-primary mr-2" />
          <Text>Tailwind CSS support</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-primary mr-2" />
          <Text>Native performance</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-primary mr-2" />
          <Text>Reusable business logic</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-primary mr-2" />
          <Text>Cross-platform components</Text>
        </View>
      </View>
    </ScrollView>
  );
}
```

## 📦 Package Structure

ReactorJS is composed of several packages that work together:

- **reactorjs**: Core framework with Virtual DOM, Component system, and Hooks
- **reactorjs-router**: File-based routing and navigation system
- **reactorjs-styling**: Styling solution with Tailwind CSS and shadcn/ui integration
- **reactorjs-native**: React Native integration and bridge
- **reactorjs-cli**: Command-line interface for project scaffolding
- **reactorjs-ui**: UI component library based on shadcn/ui

## 🔧 Configuration

ReactorJS uses a configuration file (`reactorjs.config.js`) to customize various aspects of your application:

```js
// reactorjs.config.js
module.exports = {
  // General settings
  appName: 'My ReactorJS App',
  
  // Platforms to build for
  platforms: ['web', 'native'],
  
  // Web configuration
  web: {
    devPort: 3000,
    buildDir: 'dist',
    publicDir: 'public',
    ssr: true,
    ssg: {
      enabled: true,
      paths: ['/about', '/contact']
    }
  },
  
  // Native configuration
  native: {
    appId: 'com.example.myapp',
    platforms: ['ios', 'android'],
  },
  
  // Styling options
  styling: {
    tailwind: true,
    shadcn: true,
    theme: {
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
      }
    }
  }
};
```

## 🔄 State Management

ReactorJS offers multiple ways to manage state:

### 1. Component State

```jsx
// Class component
class Counter extends ReactorJS.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }
  
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

// Functional component with hooks
function HookCounter() {
  const [count, setCount] = ReactorJS.useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### 2. Context API

```jsx
// Create a context
const ThemeContext = ReactorJS.createContext({ theme: 'light' });

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = ReactorJS.useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer component
function ThemedButton() {
  const { theme, toggleTheme } = ReactorJS.useContext(ThemeContext);
  
  return (
    <button 
      className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-primary text-white' : 'bg-gray-800 text-white'}`}
      onClick={toggleTheme}
    >
      Toggle Theme (Current: {theme})
    </button>
  );
}
```

### 3. Global Store

```jsx
// Create a store
const store = ReactorJS.createStore({
  state: {
    count: 0,
    user: null
  },
  
  reducers: {
    INCREMENT: (state) => ({ ...state, count: state.count + 1 }),
    DECREMENT: (state) => ({ ...state, count: state.count - 1 }),
    SET_USER: (state, user) => ({ ...state, user })
  }
});

// Connect component to store
function ConnectedCounter() {
  const { state, dispatch } = store.useStore();
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
    </div>
  );
}
```

### 4. Reactive State (Vue-inspired)

```jsx
// Create reactive state
const state = ReactorJS.reactive({
  count: 0,
  user: null
});

// Component using reactive state
function ReactiveCounter() {
  // This component will automatically re-render when state.count changes
  ReactorJS.watchEffect(() => {
    console.log('Count changed:', state.count);
  });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => state.count++}>Increment</button>
      <button onClick={() => state.count--}>Decrement</button>
    </div>
  );
}
```

## 📝 Server-Side Rendering

ReactorJS supports server-side rendering for improved performance and SEO:

```jsx
// Server entry point (server.js)
import { createServerApp } from 'reactorjs-router';
import express from 'express';

// Import pages and layouts
import HomePage from './src/app/pages/home';
import AboutPage from './src/app/pages/about';
import MainLayout from './src/app/layouts/main';

const app = express();

// Define routes
const pages = {
  '/': HomePage,
  '/about': AboutPage
};

// Define layouts
const layouts = {
  '/': MainLayout
};

// Create server app
const reactorApp = createServerApp({
  pages,
  layouts,
  title: 'My ReactorJS App',
  styles: tailwindStyles // Pre-generated Tailwind CSS
});

// Handle all routes
app.get('*', async (req, res) => {
  try {
    const { html, statusCode } = await reactorApp.renderPath(req.path);
    res.status(statusCode).send(html);
  } catch (error) {
    console.error('Rendering error:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## 🔌 Extending ReactorJS

### Creating Custom Plugins

```js
// my-plugin.js
module.exports = function myPlugin(options) {
  return {
    name: 'my-plugin',
    
    // Hook into the ReactorJS lifecycle
    beforeBuild() {
      console.log('Before build');
    },
    
    afterBuild() {
      console.log('After build');
    },
    
    // Extend the component API
    extendComponent(Component) {
      Component.prototype.myCustomMethod = function() {
        console.log('Custom method called');
      };
      
      return Component;
    }
  };
};

// In reactorjs.config.js
module.exports = {
  // ...other config
  plugins: [
    require('./my-plugin')({ /* options */ })
  ]
};
```

## 📱 React Native Integration

ReactorJS seamlessly integrates with React Native to build cross-platform applications:

```jsx
// src/native/index.jsx
import ReactorJS from 'reactorjs';
import { AppRegistry } from 'reactorjs-native';
import { reactorNative, TailwindProvider } from 'reactorjs-styling';

import HomeScreen from './screens/home';
import SettingsScreen from './screens/settings';

const { View, Text } = reactorNative;

// Navigation state
const [currentScreen, setCurrentScreen] = ReactorJS.useState('home');

// Simple tab navigator
const App = () => {
  return (
    <TailwindProvider>
      <View className="flex-1">
        {/* Content area */}
        <View className="flex-1">
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
        </View>
        
        {/* Tab bar */}
        <View className="flex-row border-t border-gray-200">
          <View 
            className={`flex-1 py-4 items-center ${currentScreen === 'home' ? 'bg-primary' : 'bg-white'}`}
            onPress={() => setCurrentScreen('home')}
          >
            <Text className={currentScreen === 'home' ? 'text-white' : 'text-gray-700'}>
              Home
            </Text>
          </View>
          
          <View 
            className={`flex-1 py-4 items-center ${currentScreen === 'settings' ? 'bg-primary' : 'bg-white'}`}
            onPress={() => setCurrentScreen('settings')}
          >
            <Text className={currentScreen === 'settings' ? 'text-white' : 'text-gray-700'}>
              Settings
            </Text>
          </View>
        </View>
      </View>
    </TailwindProvider>
  );
};

// Register the app
AppRegistry.registerComponent('MyApp', () => App);
```

## 🛠️ CLI Commands

ReactorJS CLI provides various commands to streamline development:

```bash
# Create a new project
reactorjs create my-app

# Start development server
reactorjs dev

# Build for production
reactorjs build

# Build for specific platform
reactorjs build web
reactorjs build native

# Generate component
reactorjs generate component Button

# Generate page
reactorjs generate page About

# Generate layout
reactorjs generate layout Main
```

## 📊 Performance Optimization

ReactorJS includes several features for optimal performance:

- **Tree Shaking**: Eliminates unused code
- **Code Splitting**: Loads components on demand
- **Lazy Loading**: Defers loading of non-critical components
- **Memoization**: Prevents unnecessary re-renders
- **Server-side Rendering**: Improves initial load time
- **Static Site Generation**: Pre-renders pages for maximum performance

## 📚 Documentation

For comprehensive documentation, visit [reactorjs.dev](https://reactorjs.dev).

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guide](CONTRIBUTING.md) to get started.

## 📄 License

ReactorJS is [MIT licensed](LICENSE).