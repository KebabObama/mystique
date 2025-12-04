"use client";

import type React from "react";
import Dialog from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type ResponsiveDialogProps = {
  asChild?: boolean;
  trigger: React.ReactNode;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export const ResponsiveDialog = ({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  className,
  asChild = false,
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Drawer onOpenChange={onOpenChange} open={open}>
        <DrawerTrigger asChild={asChild}>{trigger}</DrawerTrigger>
        <DrawerContent className={cn("p-4", className)}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          {children}
          {footer && <DrawerFooter>{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <Dialog.Trigger asChild={asChild}>{trigger}</Dialog.Trigger>
      <Dialog.Content className={className}>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          {description && (
            <Dialog.Description>{description}</Dialog.Description>
          )}
        </Dialog.Header>
        {children}
        {footer && <Dialog.Footer>{footer}</Dialog.Footer>}
      </Dialog.Content>
    </Dialog>
  );
};
