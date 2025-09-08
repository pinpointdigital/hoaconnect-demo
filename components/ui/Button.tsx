import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center font-medium transition-all duration-150 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Focus styles
        'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        
        // Size variants
        {
          'h-9 px-4 text-[15px] rounded-ctl': size === 'sm',
          'h-10 px-5 text-[15px] rounded-ctl': size === 'md',
          'h-12 px-6 text-[15px] rounded-ctl': size === 'lg',
        },
        
        // Color variants with visible hover effects
        {
          'bg-primary text-white shadow-elev1 hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20': variant === 'primary',
          'bg-neutral-100 text-ink-900 hover:bg-neutral-50 hover:-translate-y-0.5 hover:shadow-md border border-transparent hover:border-ink-900/10': variant === 'secondary',
          'bg-transparent text-ink-900 hover:bg-neutral-100 hover:-translate-y-0.5 hover:shadow-sm': variant === 'ghost',
          'bg-transparent text-primary underline-offset-2 hover:underline hover:text-primary-700 hover:bg-primary/5 h-auto p-0 rounded-none': variant === 'link',
        },
        
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
