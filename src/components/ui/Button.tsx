import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer';
  
  const variants = {
    primary: 'bg-slate-950 text-white hover:bg-slate-800 shadow-lg shadow-slate-950/10 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300',
    secondary: 'bg-white/80 text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-700',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-950/10',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
};
