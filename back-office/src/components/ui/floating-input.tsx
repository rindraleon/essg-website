// src/components/ui/floating-input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, id, value, type = "text", ...props }, ref) => {
    const hasValue =
      value !== undefined && value !== null && String(value).length > 0;

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          placeholder=" "
          className={cn(
            "peer w-full rounded-md border bg-white px-3 pt-5 pb-1.5 text-sm",
            "outline-none transition-all",
            "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "placeholder-transparent",
            error
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-300",
            className
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none",
            "text-gray-500 origin-[0]",
            hasValue || props.placeholder !== " "
              ? "top-1.5 text-[10px] font-medium"
              : "top-1/2 -translate-y-1/2 text-sm",
            "peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-medium peer-focus:-translate-y-0",
            "peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:-translate-y-0",
            error
              ? "text-red-500 peer-focus:text-red-500"
              : "peer-focus:text-blue-600"
          )}
        >
          {label}
        </label>
        {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };