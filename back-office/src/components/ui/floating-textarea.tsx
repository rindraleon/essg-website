// src/components/ui/floating-textarea.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ className, label, error, hint, id, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== null && String(value).length > 0;

    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          id={id}
          value={value}
          placeholder=" "
          className={cn(
            'peer w-full rounded-md border bg-white px-3 pt-5 pb-2 text-sm',
            'outline-none transition-all resize-none',
            'focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
            'placeholder-transparent',
            error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-ink-300',
            className
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            'absolute left-3 transition-all duration-200 pointer-events-none',
            'text-ink-500 origin-[0]',
            hasValue ? 'top-1.5 text-[10px] font-medium' : 'top-3 text-sm',
            'peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-medium',
            'peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-medium',
            error ? 'text-red-500 peer-focus:text-red-500' : 'peer-focus:text-brand-600'
          )}
        >
          {label}
        </label>
        {(error || hint) && (
          <p className={cn('mt-1 text-[11px]', error ? 'text-red-500' : 'text-ink-400')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);
FloatingTextarea.displayName = 'FloatingTextarea';

export { FloatingTextarea };
