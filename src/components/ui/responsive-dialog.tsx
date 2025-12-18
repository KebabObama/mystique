"use client";

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
import type React from "react";

type ResponsiveDialogProps = {
  asChild?: boolean;
  trigger: React.ReactNode;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?(open: boolean): void;
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
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className={cn("p-3", className)}>{children}</div>
          {footer && <DrawerFooter className="mt-0 p-3">{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <Dialog.Trigger asChild={asChild}>{trigger}</Dialog.Trigger>
      <Dialog.Content className="md:min-w-2xl lg:min-w-4xl xl:min-w-6xl">
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
        </Dialog.Header>
        <div className={cn("mb-3", className)}>{children}</div>
        {footer && <Dialog.Footer>{footer}</Dialog.Footer>}
      </Dialog.Content>
    </Dialog>
  );
};
