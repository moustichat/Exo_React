import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/85 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
