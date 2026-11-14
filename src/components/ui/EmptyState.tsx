import React from 'react';
import { BookOpenIcon } from './icons';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  actionHref,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-14 px-6 rounded-3xl border border-slate-200/90 bg-white shadow-xs max-w-xl mx-auto ${className}`}
    >
      <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4.5 shadow-xs border border-blue-100">
        {icon || <BookOpenIcon className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && (
        <div>
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center justify-center font-semibold rounded-xl text-sm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              {actionText}
            </a>
          ) : onAction ? (
            <Button onClick={onAction} variant="primary" size="md">
              {actionText}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};
