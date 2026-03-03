"use client";

import { cn } from "@/lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

const RetroFrame = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-card relative", className)}>
    <div className="bg-border absolute -top-1.5 right-1.5 left-1.5 h-1.5" />
    <div className="bg-border absolute right-1.5 -bottom-1.5 left-1.5 h-1.5" />
    <div className="bg-border absolute top-1.5 bottom-1.5 -left-1.5 w-1.5" />
    <div className="bg-border absolute top-1.5 -right-1.5 bottom-1.5 w-1.5" />
    <div className="bg-border absolute top-0 left-0 size-1.5" />
    <div className="bg-border absolute top-0 right-0 size-1.5" />
    <div className="bg-border absolute bottom-0 left-0 size-1.5" />
    <div className="bg-border absolute right-0 bottom-0 size-1.5" />
    {children}
  </div>
);

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <RetroFrame className={className}>
    <SelectPrimitive.Trigger
      ref={ref}
      className="flex h-10 w-full items-center justify-between px-3 text-sm font-bold uppercase outline-none disabled:opacity-50"
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Trigger>
  </RetroFrame>
));

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn("relative z-50 mt-2 min-w-(--radix-select-trigger-width)", className)}
      position={position}
      {...props}
    >
      <RetroFrame className="w-(--radix-select-trigger-width)">
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" && "h-full w-full min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </RetroFrame>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "focus:text-border relative flex w-full cursor-default items-center py-1.5 pr-2 pl-8 text-sm font-bold uppercase outline-none select-none",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
