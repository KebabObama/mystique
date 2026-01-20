import { Border } from "@/components/ui/border";
import { cn } from "@/lib/utils";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as React from "react";

const Context = ContextMenuPrimitive.Root;
const ContextTrigger = ContextMenuPrimitive.Trigger;

const ContextContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ContextMenuPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md",
        "animate-in fade-in-80 data-[state=open]:scale-in-95",
        className
      )}
      {...props}
    >
      {children}
      <Border />
    </ContextMenuPrimitive.Content>
  </ContextMenuPrimitive.Portal>
));

const ContextItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ContextMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-xs outline-none select-none",
      className
    )}
    {...props}
  />
));

const Menu = Object.assign(Context, {
  Trigger: ContextTrigger,
  Content: ContextContent,
  Item: ContextItem,
});

export { Menu as Context };
