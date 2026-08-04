// src/components/ui/floating-select.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { SelectRootChangeEventDetails } from '@base-ui/react/select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FloatingSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string | null, eventDetails: SelectRootChangeEventDetails) => void;
  options: { label: string; value: string }[];
  error?: string;
  placeholder?: string;
  className?: string;
}

const FloatingSelect: React.FC<FloatingSelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  error,
  placeholder = ' ',
  className,
}) => {
  const hasValue = !!value;

  return (
    <div className="relative w-full">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            'w-full bg-white pt-5 pb-1.5 px-3 h-auto min-h-[48px] text-sm',
            'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
            error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300',
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="hover:bg-gray-100">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span
        className={cn(
          'absolute left-3 transition-all duration-200 pointer-events-none',
          'origin-[0]',
          hasValue ? 'top-1.5 text-[10px] font-medium' : 'top-1/2 -translate-y-1/2 text-sm',
          error ? 'text-red-500' : 'text-gray-500'
        )}
      >
        {label}
      </span>
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
};

export { FloatingSelect };
