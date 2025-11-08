import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, startAdornment, endAdornment, ...props }, ref) => {
  const hasStart = !!startAdornment;
  const hasEnd = !!endAdornment;

  return (
    <div className={cn('relative w-full')}>
      {hasStart && (
        <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none">
          {startAdornment}
        </div>
      )}

      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          hasStart ? 'pl-10' : 'px-3',
          hasEnd ? 'pr-10' : '',
          className,
        )}
        ref={ref}
        {...props}
      />

      {hasEnd && (
        <div className="absolute right-3 top-0 bottom-0 flex items-center pointer-events-none">
          {endAdornment}
        </div>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
