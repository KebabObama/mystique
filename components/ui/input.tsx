import { cn } from "@/lib/utils";
import type * as React from "react";
import { Border } from "./border";

export const Input = ({ className, type, ...props }: React.ComponentProps<"input">) => {
  return (
    <div className={cn("relative", className)}>
      <input
        className={cn(
          "file:text-foreground placeholder:text-muted bg-card selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-none border px-3 py-1 text-base shadow-xs ring-0 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        data-slot="input"
        type={type}
        {...props}
      />
      <Border />
    </div>
  );
};
