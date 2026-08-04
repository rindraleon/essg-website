import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, id, type = 'text', ...props }, ref) => {
    return (
      <div className="relative mt-5">
        <Input
          ref={ref}
          id={id}
          type={type}
          placeholder=" "
          className={cn(
            'peer h-12 rounded-md border border-gray-300 px-3 pt-5 pb-2 text-base',
            'focus-visible:border-green-800',
            'focus-visible:ring-0',
            'focus-visible:ring-offset-0',
            error && 'border-red-500',
            className
          )}
          {...props}
        />

        <Label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-[10px] -top-[10px] z-10',
            'bg-background px-1 text-xs font-bold text-green-700',
            'transition-all duration-200',
            'peer-placeholder-shown:top-[10px]',
            'peer-placeholder-shown:left-[10px]',
            'peer-placeholder-shown:bg-transparent',
            'peer-placeholder-shown:px-0',
            'peer-placeholder-shown:text-base',
            'peer-placeholder-shown:font-normal',
            'peer-placeholder-shown:text-gray-400',
            'peer-focus:-top-[10px]',
            'peer-focus:left-2',
            'peer-focus:bg-background',
            'peer-focus:px-1',
            'peer-focus:text-xs',
            'peer-focus:font-bold',
            'peer-focus:text-green-800',
            error && 'text-red-500 peer-focus:text-red-500'
          )}
        >
          {label}
        </Label>
        {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
      </div>
    );
  }
);
FloatingInput.displayName = 'FloatingInput';

export { FloatingInput };
