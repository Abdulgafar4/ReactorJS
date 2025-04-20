// ui/components/base.js - Base UI components

import { createElement } from '../../core/vdom.js';
import { useContext } from '../../core/hooks.js';
import { tailwind } from '../../styling/tailwind.js';

/**
 * Button component
 */
function Button({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  disabled, 
  ...props 
}) {
  // Variant classes
  const variantClasses = {
    default: 'bg-primary text-white hover:bg-primary/90',
    destructive: 'bg-danger text-white hover:bg-danger/90',
    outline: 'border border-dark/20 hover:bg-light dark:border-light/20 dark:hover:bg-dark/80',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    ghost: 'hover:bg-light dark:hover:bg-dark/80',
    link: 'text-primary underline-offset-4 hover:underline'
  };
  
  // Size classes
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 py-1 text-sm',
    lg: 'h-12 px-6 py-3 text-lg',
    icon: 'h-10 w-10'
  };
  
  const baseClasses = 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:pointer-events-none disabled:opacity-50';
  
  // Combine all classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`;
  
  return createElement(
    'button',
    {
      className: combinedClasses,
      disabled,
      ...props
    },
    children
  );
}

/**
 * Input component
 */
function Input({ className = '', type = 'text', ...props }) {
  const baseClasses = 'flex h-10 w-full rounded border border-dark/20 bg-light px-3 py-2 text-base placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-light/20 dark:bg-dark dark:text-white';
  
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'input',
    {
      className: combinedClasses,
      type,
      ...props
    }
  );
}

/**
 * Checkbox component
 */
function Checkbox({ className = '', checked, onChange, ...props }) {
  const baseClasses = 'h-4 w-4 rounded border border-dark/20 bg-light text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-light/20 dark:bg-dark dark:ring-offset-dark';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'input',
    {
      type: 'checkbox',
      className: combinedClasses,
      checked,
      onChange,
      ...props
    }
  );
}

/**
 * Select component
 */
function Select({ className = '', children, ...props }) {
  const baseClasses = 'flex h-10 w-full rounded-md border border-dark/20 bg-light px-3 py-2 text-base ring-offset-white placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-light/20 dark:bg-dark dark:text-white dark:ring-offset-dark';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'select',
    {
      className: combinedClasses,
      ...props
    },
    children
  );
}

/**
 * Label component
 */
function Label({ className = '', htmlFor, required, children, ...props }) {
  const baseClasses = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'label',
    {
      className: combinedClasses,
      htmlFor,
      ...props
    },
    children,
    required && createElement('span', { className: 'text-danger ml-1' }, '*')
  );
}

/**
 * Textarea component
 */
function Textarea({ className = '', ...props }) {
  const baseClasses = 'flex min-h-[80px] w-full rounded-md border border-dark/20 bg-light px-3 py-2 text-base ring-offset-white placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-light/20 dark:bg-dark dark:text-white dark:ring-offset-dark';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'textarea',
    {
      className: combinedClasses,
      ...props
    }
  );
}

export {
  Button,
  Input,
  Checkbox,
  Select,
  Label,
  Textarea
};