// ui/components/feedback.js - Feedback components

import { createElement } from '../../core/vdom.js';

/**
 * Alert component
 */
function Alert({ className = '', variant = 'default', children, ...props }) {
  const variantClasses = {
    default: 'bg-light text-dark dark:bg-dark dark:text-light',
    destructive: 'bg-danger/15 text-danger dark:bg-danger/20',
    success: 'bg-success/15 text-success dark:bg-success/20',
    warning: 'bg-warning/15 text-warning dark:bg-warning/20',
    info: 'bg-info/15 text-info dark:bg-info/20'
  };
  
  const baseClasses = 'relative w-full rounded-lg border p-4';
  const borderClasses = {
    default: 'border-dark/20 dark:border-light/20',
    destructive: 'border-danger/50 dark:border-danger/50',
    success: 'border-success/50 dark:border-success/50',
    warning: 'border-warning/50 dark:border-warning/50',
    info: 'border-info/50 dark:border-info/50'
  };
  
  const combinedClasses = `${baseClasses} ${borderClasses[variant] || borderClasses.default} ${variantClasses[variant] || variantClasses.default} ${className}`;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      role: 'alert',
      ...props
    },
    children
  );
}

/**
 * AlertTitle component
 */
function AlertTitle({ className = '', children, ...props }) {
  const baseClasses = 'mb-1 font-medium leading-none tracking-tight';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'h5',
    {
      className: combinedClasses,
      ...props
    },
    children
  );
}

/**
 * AlertDescription component
 */
function AlertDescription({ className = '', children, ...props }) {
  const baseClasses = 'text-base leading-relaxed';
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
 * Badge component
 */
function Badge({ className = '', variant = 'default', size = 'default', children, ...props }) {
  const variantClasses = {
    default: 'bg-primary text-white hover:bg-primary/80',
    secondary: 'bg-secondary text-white hover:bg-secondary/80',
    destructive: 'bg-danger text-white hover:bg-danger/80',
    outline: 'border border-dark/20 text-dark hover:bg-light dark:border-light/20 dark:text-light dark:hover:bg-dark/80',
    success: 'bg-success text-white hover:bg-success/80',
    warning: 'bg-warning text-dark hover:bg-warning/80',
    info: 'bg-info text-white hover:bg-info/80'
  };
  
  const sizeClasses = {
    default: 'px-2.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-0.5 text-sm'
  };
  
  const baseClasses = 'inline-flex items-center rounded-full font-medium transition-colors';
  const combinedClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`;
  
  return createElement(
    'span',
    {
      className: combinedClasses,
      ...props
    },
    children
  );
}

/**
 * Toast container component
 */
function ToastContainer({ className = '', position = 'bottom-right', ...props }) {
  const positionClasses = {
    'top-left': 'top-0 left-0 p-4',
    'top-center': 'top-0 left-1/2 -translate-x-1/2 p-4',
    'top-right': 'top-0 right-0 p-4',
    'bottom-left': 'bottom-0 left-0 p-4',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 p-4',
    'bottom-right': 'bottom-0 right-0 p-4'
  };
  
  const baseClasses = 'fixed z-50 flex flex-col gap-2 max-w-md';
  const combinedClasses = `${baseClasses} ${positionClasses[position] || positionClasses['bottom-right']} ${className}`;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      role: 'region',
      'aria-label': 'Notifications',
      ...props
    }
  );
}

/**
 * Toast component
 */
function Toast({ className = '', variant = 'default', title, description, duration = 5000, onClose, children, ...props }) {
  const variantClasses = {
    default: 'bg-white border-dark/10 dark:bg-dark dark:border-light/10',
    destructive: 'bg-danger/10 border-danger/20 text-danger dark:bg-danger/20',
    success: 'bg-success/10 border-success/20 text-success dark:bg-success/20'
  };
  
  const baseClasses = 'relative rounded-lg border p-4 shadow-md w-full max-w-md pointer-events-auto animate-in fade-in slide-in-from-bottom-5 duration-300';
  const combinedClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      role: 'alert',
      ...props
    },
    title && createElement('div', { className: 'font-medium leading-none mb-1' }, title),
    description && createElement('div', { className: 'text-sm opacity-90' }, description),
    children,
    onClose && createElement(
      'button',
      {
        className: 'absolute top-2 right-2 opacity-70 hover:opacity-100',
        onClick: onClose,
        'aria-label': 'Close'
      },
      '×'
    )
  );
}

/**
 * Progress component
 */
function Progress({ className = '', value = 0, max = 100, ...props }) {
  const baseClasses = 'h-2 w-full overflow-hidden rounded-full bg-light dark:bg-dark/50';
  const combinedClasses = `${baseClasses} ${className}`;
  
  const percentage = Math.min(Math.max(0, value), max) / max * 100;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': max,
      'aria-valuenow': value,
      ...props
    },
    createElement('div', {
      className: 'h-full bg-primary',
      style: { width: `${percentage}%` }
    })
  );
}

/**
 * Spinner component
 */
function Spinner({ className = '', size = 'default', ...props }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    default: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4'
  };
  
  const baseClasses = 'inline-block rounded-full border-primary/30 border-t-primary animate-spin';
  const combinedClasses = `${baseClasses} ${sizeClasses[size] || sizeClasses.default} ${className}`;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      role: 'status',
      'aria-label': 'Loading',
      ...props
    }
  );
}

export {
  Alert,
  AlertTitle,
  AlertDescription,
  Badge,
  ToastContainer,
  Toast,
  Progress,
  Spinner
};