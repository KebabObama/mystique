"use client";

import { Border } from "@/components/ui/border";
import { cn } from "@/lib/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type * as React from "react";

const Avatar = ({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) => {
  return (
    <AvatarPrimitive.Root
      className={cn("relative flex size-9 shrink-0 rounded-none", className)}
      data-slot="avatar"
      {...props}
    >
      <Border />
      {props.children}
    </AvatarPrimitive.Root>
  );
};

const AvatarImage = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) => {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square size-full", className)}
      data-slot="avatar-image"
      suppressContentEditableWarning
      suppressHydrationWarning
      {...props}
    />
  );
};

const AvatarFallback = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => {
  return (
    <AvatarPrimitive.Fallback
      className={cn("bg-muted flex size-full items-center justify-center rounded-none", className)}
      data-slot="avatar-fallback"
      {...props}
    />
  );
};

export { Avatar, AvatarFallback, AvatarImage };
