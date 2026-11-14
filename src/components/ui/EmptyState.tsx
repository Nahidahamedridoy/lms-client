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
      className={`text-center py-12 px-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 max-w-xl mx-auto ${className}`}
    >
      <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
        {icon || <BookOpenIcon className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && (
        <div>
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
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
