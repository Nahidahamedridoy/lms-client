import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'royal' | 'navy' | 'accent' | 'emerald' | 'slate' | 'rose' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'royal',
  size = 'md',
  className = '',
}) => {
  const variants = {
    royal: 'bg-blue-50 text-blue-700 border-blue-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    navy: 'bg-[#14213D]/10 text-[#14213D] border-[#14213D]/20',
    accent: 'bg-amber-50 text-amber-800 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 font-semibold',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
