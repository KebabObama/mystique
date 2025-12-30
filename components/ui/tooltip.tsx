"use client";

import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

/**
 * Reusable Retro Frame with your Border logic
 */
const RetroFrame = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-card relative px-3 py-1.5", className)}>
    {/* Horizontal Bars */}
    <div className="bg-border absolute -top-1.5 right-1.5 left-1.5 h-1.5" />
    <div className="bg-border absolute right-1.5 -bottom-1.5 left-1.5 h-1.5" />

    {/* Vertical Bars */}
    <div className="bg-border absolute top-1.5 bottom-1.5 -left-1.5 w-1.5" />
    <div className="bg-border absolute top-1.5 -right-1.5 bottom-1.5 w-1.5" />

    {/* Corner Blocks */}
    <div className="bg-border absolute top-0 left-0 size-1.5" />
    <div className="bg-border absolute top-0 right-0 size-1.5" />
    <div className="bg-border absolute bottom-0 left-0 size-1.5" />
    <div className="bg-border absolute right-0 bottom-0 size-1.5" />

    {children}
  </div>
);

const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) => {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
};

const Tooltip = ({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
};

const TooltipTrigger = ({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) => {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
};

const TooltipContent = ({
  className,
  sideOffset = 8, // Increased offset to accommodate the 1.5px external borders
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 w-fit",
          className
        )}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...props}
      >
        <RetroFrame className="text-foreground text-xs font-bold tracking-tighter uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {children}
        </RetroFrame>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
