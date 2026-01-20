"use client";

import { Border } from "@/components/ui/border";
import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import type * as React from "react";

const Body = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) => {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2", className)}
      data-slot="tabs"
      {...props}
    />
  );
};

const List = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => {
  return (
    <div className="relative">
      <TabsPrimitive.List
        className={cn(
          "bg-card text-muted inline-flex h-9 w-fit items-center justify-center rounded-none p-0.75",
          className
        )}
        data-slot="tabs-list"
        {...props}
      >
        {children}
      </TabsPrimitive.List>
      <Border />
    </div>
  );
};

const Trigger = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) => {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "data-[state=active]:bg-accent data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-muted inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-none border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
};

const Content = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      className={cn("flex-1 outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
};

export default Object.assign(Body, { List, Content, Trigger });
