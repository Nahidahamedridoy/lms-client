import React from 'react';
import { AlertCircleIcon, RefreshIcon } from './icons';
import { Button } from './Button';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'API Connection Error',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-xl border border-rose-200 bg-rose-50/70 p-5 text-rose-900 shadow-xs ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="text-rose-600 mt-0.5 shrink-0">
          <AlertCircleIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-rose-900 mb-1">{title}</h4>
          <p className="text-sm text-rose-700 leading-relaxed break-words">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-rose-300 text-rose-800 hover:bg-rose-100 bg-white"
                leftIcon={<RefreshIcon className="w-3.5 h-3.5" />}
              >
                Retry Request
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
