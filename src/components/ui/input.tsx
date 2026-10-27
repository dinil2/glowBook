import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-ink uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-2xl border border-muted-border bg-white px-4 py-2 text-sm text-ink transition-all',
            'placeholder:text-muted/60 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-ruby-500 focus-visible:ring-ruby-500/20 focus-visible:border-ruby-500',
            className
          )}
          {...props}
        />
        {helperText && !error && <p className="text-xs text-muted">{helperText}</p>}
        {error && <p className="text-xs font-medium text-ruby-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
