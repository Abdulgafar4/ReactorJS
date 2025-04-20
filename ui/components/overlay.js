// ui/components/overlay.js - Overlay components

import { createElement } from '../../core/vdom.js';
import { useState, useEffect, createContext, useContext } from '../../core/hooks.js';

/**
 * Dialog context for state management
 */
const DialogContext = createContext({ open: false, onOpenChange: () => {} });

/**
 * Dialog component for modal dialogs
 */
function Dialog({ open, defaultOpen = false, onOpenChange, children }) {
  const [isOpen, setIsOpen] = useState(open !== undefined ? open : defaultOpen);
  
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);
  
  const handleOpenChange = (value) => {
    if (open === undefined) {
      setIsOpen(value);
    }
    onOpenChange?.(value);
  };
  
  return createElement(
    DialogContext.Provider,
    { value: { open: isOpen, onOpenChange: handleOpenChange } },
    children
  );
}

/**
 * DialogTrigger component
 */
function DialogTrigger({ className = '', children, asChild = false, ...props }) {
  const { onOpenChange } = useContext(DialogContext);
  
  return createElement(
    'button',
    {
      className,
      onClick: () => onOpenChange(true),
      ...props
    },
    children
  );
}

/**
 * DialogPortal component
 */
function DialogPortal({ children }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!mounted) return null;
  
  // In a real implementation, this would use a portal
  return children;
}

/**
 * DialogOverlay component
 */
function DialogOverlay({ className = '', ...props }) {
  const { open } = useContext(DialogContext);
  
  if (!open) return null;
  
  const baseClasses = 'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      'data-state': open ? 'open' : 'closed',
      ...props
    }
  );
}

/**
 * DialogContent component
 */
function DialogContent({ className = '', children, ...props }) {
  const { open, onOpenChange } = useContext(DialogContext);
  
  if (!open) return null;
  
  const baseClasses = 'fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-dark/20 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-light/20 dark:bg-dark';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    DialogPortal,
    null,
    createElement(DialogOverlay),
    createElement(
      'div',
      {
        className: combinedClasses,
        role: 'dialog',
        'aria-modal': 'true',
        'data-state': open ? 'open' : 'closed',
        ...props
      },
      children,
      createElement(
        'button',
        {
          className: 'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none dark:text-white dark:ring-offset-dark',
          onClick: () => onOpenChange(false),
          'aria-label': 'Close'
        },
        '×' // Close icon (would be an SVG in real implementation)
      )
    )
  );
}

/**
 * DialogHeader component
 */
function DialogHeader({ className = '', children, ...props }) {
  const baseClasses = 'flex flex-col space-y-1.5 text-center sm:text-left';
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
 * DialogTitle component
 */
function DialogTitle({ className = '', children, ...props }) {
  const baseClasses = 'text-lg font-semibold leading-none tracking-tight';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'h2',
    {
      className: combinedClasses,
      ...props
    },
    children
  );
}

/**
 * DialogDescription component
 */
function DialogDescription({ className = '', children, ...props }) {
  const baseClasses = 'text-sm text-secondary dark:text-secondary/70';
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
 * DialogFooter component
 */
function DialogFooter({ className = '', children, ...props }) {
  const baseClasses = 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2';
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
 * Drawer context for state management
 */
const DrawerContext = createContext({ open: false, onOpenChange: () => {} });

/**
 * Drawer component for slide-in panels
 */
function Drawer({ open, defaultOpen = false, onOpenChange, side = 'right', children }) {
  const [isOpen, setIsOpen] = useState(open !== undefined ? open : defaultOpen);
  
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);
  
  const handleOpenChange = (value) => {
    if (open === undefined) {
      setIsOpen(value);
    }
    onOpenChange?.(value);
  };
  
  return createElement(
    DrawerContext.Provider,
    { value: { open: isOpen, onOpenChange: handleOpenChange, side } },
    children
  );
}

/**
 * DrawerTrigger component
 */
function DrawerTrigger({ className = '', children, ...props }) {
  const { onOpenChange } = useContext(DrawerContext);
  
  return createElement(
    'button',
    {
      className,
      onClick: () => onOpenChange(true),
      ...props
    },
    children
  );
}

/**
 * DrawerOverlay component
 */
function DrawerOverlay({ className = '', ...props }) {
  const { open } = useContext(DrawerContext);
  
  if (!open) return null;
  
  const baseClasses = 'fixed inset-0 z-50 bg-black/80';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      ...props
    }
  );
}

/**
 * DrawerContent component
 */
function DrawerContent({ className = '', children, ...props }) {
  const { open, onOpenChange, side } = useContext(DrawerContext);
  
  if (!open) return null;
  
  // Position based on side
  const sideClasses = {
    right: 'right-0 h-full',
    left: 'left-0 h-full',
    top: 'top-0 w-full',
    bottom: 'bottom-0 w-full'
  };
  
  const baseClasses = 'fixed z-50 bg-white dark:bg-dark p-6 shadow-lg';
  const positionClass = sideClasses[side] || sideClasses.right;
  const combinedClasses = `${baseClasses} ${positionClass} ${className}`;
  
  return createElement(
    'div',
    null,
    createElement(DrawerOverlay, { onClick: () => onOpenChange(false) }),
    createElement(
      'div',
      {
        className: combinedClasses,
        role: 'dialog',
        'aria-modal': 'true',
        ...props
      },
      children,
      createElement(
        'button',
        {
          className: 'absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100',
          onClick: () => onOpenChange(false),
          'aria-label': 'Close'
        },
        '×' // Close icon
      )
    )
  );
}

/**
 * Tooltip context
 */
const TooltipContext = createContext({ open: false, onOpenChange: () => {} });

/**
 * Tooltip component
 */
function Tooltip({ open, defaultOpen = false, onOpenChange, delayDuration = 700, children }) {
  const [isOpen, setIsOpen] = useState(open !== undefined ? open : defaultOpen);
  
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);
  
  const handleOpenChange = (value) => {
    if (open === undefined) {
      setIsOpen(value);
    }
    onOpenChange?.(value);
  };
  
  return createElement(
    TooltipContext.Provider,
    { value: { open: isOpen, onOpenChange: handleOpenChange, delayDuration } },
    children
  );
}

/**
 * TooltipTrigger component
 */
function TooltipTrigger({ className = '', children, ...props }) {
  const { onOpenChange, delayDuration } = useContext(TooltipContext);
  let timeout;
  
  const handleMouseEnter = () => {
    timeout = setTimeout(() => onOpenChange(true), delayDuration);
  };
  
  const handleMouseLeave = () => {
    clearTimeout(timeout);
    onOpenChange(false);
  };
  
  return createElement(
    'span',
    {
      className,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: () => onOpenChange(true),
      onBlur: () => onOpenChange(false),
      ...props
    },
    children
  );
}

/**
 * TooltipContent component
 */
function TooltipContent({ className = '', children, ...props }) {
  const { open } = useContext(TooltipContext);
  
  if (!open) return null;
  
  const baseClasses = 'z-50 overflow-hidden rounded-md bg-dark px-3 py-1.5 text-xs text-white animate-in fade-in-0 zoom-in-95';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return createElement(
    'div',
    {
      className: combinedClasses,
      role: 'tooltip',
      ...props
    },
    children
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Drawer,
  DrawerTrigger,
  DrawerOverlay,
  DrawerContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent
};