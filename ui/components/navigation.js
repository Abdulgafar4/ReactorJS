// ui/components/navigation.js - Navigation components

import { createElement } from '../../core/vdom.js';
import { useState, useContext, createContext } from '../../core/hooks.js';

/**
 * Tabs context for state management
 */
const TabsContext = createContext({ value: null, onValueChange: () => {} });

/**
 * Tabs component
 */
function Tabs({ defaultValue, value, onValueChange, className = '', children, ...props }) {
  const [selectedValue, setSelectedValue] = useState(value || defaultValue);
  
  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setSelectedValue(newValue);
    }
    onValueChange?.(newValue);
  };
  
  const baseClasses = 'w-full';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    TabsContext.Provider,
    { value: { value: value || selectedValue, onValueChange: handleValueChange } },
    createElement(
      'div',
      {
        className: combinedClasses,
        'data-state': value || selectedValue ? 'active' : 'inactive',
        ...props
      },
      children
    )
  );
}

/**
 * TabsList component
 */
function TabsList({ className = '', children, ...props }) {
  const baseClasses = 'inline-flex h-10 items-center justify-center rounded-md bg-light p-1 dark:bg-dark/50';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      role: 'tablist',
      ...props
    },
    children
  );
}

/**
 * TabsTrigger component
 */
function TabsTrigger({ className = '', value, children, disabled = false, ...props }) {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isSelected = selectedValue === value;
  
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50';
  const stateClasses = isSelected 
    ? 'bg-white text-dark shadow-sm dark:bg-dark dark:text-white' 
    : 'text-secondary hover:text-dark dark:text-secondary/70 dark:hover:text-white';
  const combinedClasses = `${baseClasses} ${stateClasses} ${className}`;
  
  return createElement(
    'button',
    {
      className: combinedClasses,
      role: 'tab',
      'aria-selected': isSelected,
      'aria-disabled': disabled,
      'data-state': isSelected ? 'active' : 'inactive',
      disabled,
      onClick: () => !disabled && onValueChange(value),
      ...props
    },
    children
  );
}

/**
 * TabsContent component
 */
function TabsContent({ className = '', value, children, ...props }) {
  const { value: selectedValue } = useContext(TabsContext);
  const isSelected = selectedValue === value;
  
  if (!isSelected) return null;
  
  const baseClasses = 'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:ring-offset-dark';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      role: 'tabpanel',
      'data-state': isSelected ? 'active' : 'inactive',
      ...props
    },
    children
  );
}

/**
 * NavigationMenu context
 */
const NavigationMenuContext = createContext({ activeItem: null, setActiveItem: () => {} });

/**
 * NavigationMenu component
 */
function NavigationMenu({ className = '', children, ...props }) {
  const [activeItem, setActiveItem] = useState(null);
  
  const baseClasses = 'relative';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    NavigationMenuContext.Provider,
    { value: { activeItem, setActiveItem } },
    createElement(
      'nav',
      {
        className: combinedClasses,
        ...props
      },
      children
    )
  );
}

/**
 * NavigationMenuList component
 */
function NavigationMenuList({ className = '', children, ...props }) {
  const baseClasses = 'flex flex-1 list-none items-center justify-center space-x-1';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'ul',
    {
      className: combinedClasses,
      ...props
    },
    children
  );
}

/**
 * NavigationMenuItem component
 */
function NavigationMenuItem({ className = '', children, value, ...props }) {
  const { activeItem, setActiveItem } = useContext(NavigationMenuContext);
  
  const baseClasses = 'relative';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'li',
    {
      className: combinedClasses,
      onMouseEnter: () => value && setActiveItem(value),
      onMouseLeave: () => value && activeItem === value && setActiveItem(null),
      ...props
    },
    children
  );
}

/**
 * NavigationMenuTrigger component
 */
function NavigationMenuTrigger({ className = '', children, ...props }) {
  const baseClasses = 'group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-light focus:bg-light focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-light/50 dark:bg-dark dark:hover:bg-dark/80 dark:focus:bg-dark/80 dark:data-[active]:bg-dark/50';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'button',
    {
      className: combinedClasses,
      ...props
    },
    children,
    createElement('span', { className: 'ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180' }, '▾')
  );
}

/**
 * NavigationMenuContent component
 */
function NavigationMenuContent({ className = '', children, ...props }) {
  const baseClasses = 'absolute left-0 top-0 w-full sm:w-auto';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      ...props
    },
    children
  );
}

/**
 * Breadcrumb component
 */
function Breadcrumb({ className = '', separator = '/', children, ...props }) {
  const baseClasses = 'flex flex-wrap items-center';
  const combinedClasses = `${baseClasses} ${className}`;
  
  // Add separators between children
  const items = [];
  const childrenArray = Array.isArray(children) ? children : [children];
  
  childrenArray.forEach((child, index) => {
    if (index > 0) {
      items.push(
        createElement('li', 
          { 
            className: 'mx-2 text-secondary', 
            'aria-hidden': true,
            key: `separator-${index}` 
          }, 
          separator
        )
      );
    }
    
    items.push(
      createElement('li', { key: `item-${index}` }, child)
    );
  });
  
  return createElement(
    'nav',
    {
      className: combinedClasses,
      'aria-label': 'Breadcrumb',
      ...props
    },
    createElement('ol', { className: 'flex items-center' }, ...items)
  );
}

/**
 * BreadcrumbItem component
 */
function BreadcrumbItem({ className = '', children, current, ...props }) {
  const baseClasses = current 
    ? 'text-dark font-medium dark:text-light' 
    : 'text-secondary hover:text-dark dark:hover:text-light';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'span',
    {
      className: combinedClasses,
      'aria-current': current ? 'page' : undefined,
      ...props
    },
    children
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  Breadcrumb,
  BreadcrumbItem
};