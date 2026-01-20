"use client";

import { Border } from "@/components/ui/border";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { Drawer } from "vaul";

const DialogContext = React.createContext({ isMobile: false, fullscreen: false });

const Root = ({
  children,
  fullscreen = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & { fullscreen?: boolean }) => {
  const isMobile = useIsMobile();
  const Component = isMobile ? Drawer.Root : DialogPrimitive.Root;
  return (
    <DialogContext.Provider value={{ isMobile, fullscreen }}>
      <Component {...props}>{children}</Component>
    </DialogContext.Provider>
  );
};

const Content = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) => {
  const { isMobile, fullscreen } = React.useContext(DialogContext);
  if (!isMobile)
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="animate-in fade-in fixed inset-0 z-50 bg-black/50 duration-200" />
        <DialogPrimitive.Content
          className={cn(
            "bg-card animate-in zoom-in-95 -translate-y-1/flex-col fixed top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col p-6 shadow-xl duration-200 sm:rounded-lg",
            fullscreen ? "h-[90vh] w-[90vw] max-w-5xl" : "w-full max-w-lg",
            className
          )}
          {...props}
        >
          <Border />
          {children}
          <DialogPrimitive.Close className="absolute top-3 right-4 text-2xl opacity-70 transition-opacity hover:opacity-100">
            ✕
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );

  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <Drawer.Content
        className={cn(
          "bg-card fixed -bottom-1.5 z-50 mx-1.5 flex w-[calc(100%-0.75rem)] flex-col p-6 outline-none",
          fullscreen ? "h-[94vh]" : "max-h-[96%]",
          className
        )}
        {...props}
      >
        <Border />
        {children}
      </Drawer.Content>
    </Drawer.Portal>
  );
};

const Trigger = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) => {
  const { isMobile } = React.useContext(DialogContext);
  const Comp = isMobile ? Drawer.Trigger : DialogPrimitive.Trigger;
  return <Comp {...props} aria-controls="trigger" />;
};

const Title = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) => {
  const { isMobile } = React.useContext(DialogContext);
  const Comp = isMobile ? Drawer.Title : DialogPrimitive.Title;
  return <Comp className={cn("-mt-3 text-lg font-bold tracking-tight", className)} {...props} />;
};

const Description = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) => {
  const { isMobile } = React.useContext(DialogContext);
  const Comp = isMobile ? Drawer.Description : DialogPrimitive.Description;
  return <Comp className={cn("text-muted mb-3 font-semibold", className)} {...props} />;
};

const Footer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-6 pt-6 sm:flex-row sm:justify-end", className)}
    {...props}
  />
);

export const Dialog = Object.assign(Root, { Root, Trigger, Content, Title, Description, Footer });
