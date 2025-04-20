// ui/components/layout.js - Layout components

import { createElement } from '../../core/vdom.js';

/**
 * Card component
 */
function Card({ className = '', children, ...props }) {
  const baseClasses = 'rounded-lg border border-dark/20 bg-white shadow-sm dark:border-light/20 dark:bg-dark';
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
 * CardHeader component
 */
function CardHeader({ className = '', children, ...props }) {
  const baseClasses = 'flex flex-col space-y-1.5 p-6';
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
 * CardTitle component
 */
function CardTitle({ className = '', children, ...props }) {
  const baseClasses = 'text-2xl font-semibold text-dark leading-none tracking-tight dark:text-white';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'h3',
    {
      className: combinedClasses,
      ...props
    },
    children
  );
}

/**
 * CardDescription component
 */
function CardDescription({ className = '', children, ...props }) {
  const baseClasses = 'text-base text-secondary dark:text-secondary/70';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'p',
    {
      className: combinedClasses,
      ...props
    },
    children
  );
}

/**
 * CardContent component
 */
function CardContent({ className = '', children, ...props }) {
  const baseClasses = 'p-6 pt-0';
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
 * CardFooter component
 */
function CardFooter({ className = '', children, ...props }) {
  const baseClasses = 'flex items-center p-6 pt-0';
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
 * Container component
 */
function Container({ className = '', maxWidth = 'lg', children, ...props }) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
    none: ''
  };
  
  const baseClasses = 'w-full mx-auto px-4';
  const combinedClasses = `${baseClasses} ${maxWidthClasses[maxWidth] || maxWidthClasses.lg} ${className}`;
  
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
 * Grid component
 */
function Grid({ className = '', columns = 1, gap = 4, children, ...props }) {
  const columnsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12'
  };
  
  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };
  
  const baseClasses = 'grid';
  const columnsClass = typeof columns === 'number' ? columnsClasses[columns] || columnsClasses[1] : columns;
  const gapClass = typeof gap === 'number' ? gapClasses[gap] || gapClasses[4] : gap;
  
  const combinedClasses = `${baseClasses} ${columnsClass} ${gapClass} ${className}`;
  
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
 * Divider component
 */
function Divider({ className = '', orientation = 'horizontal', ...props }) {
  const baseClasses = orientation === 'horizontal' 
    ? 'h-px w-full bg-dark/10 dark:bg-light/10 my-4' 
    : 'h-full w-px bg-dark/10 dark:bg-light/10 mx-4';
  
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      role: 'separator',
      'aria-orientation': orientation,
      ...props
    }
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Container,
  Grid,
  Divider
};