"use client";

import { Border } from "@/components/ui/border";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import type React from "react";
import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  message: string | React.ReactNode;
  title?: string;
  variant?: "default" | "success" | "error" | "warning";
  action?: React.MouseEventHandler<HTMLButtonElement>;
};

const toastVariants = cva(
  "select-none flex shadow-lg ring-1 ring-black/5 w-full md:max-w-md items-center p-4 font-pixelify",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "bg-green-500",
        error: "bg-destructive",
        warning: "bg-yellow-500",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

// prettier-ignore
export const toast = Object.assign(
  (options: Omit<ToastOptions, "variant">) => sonnerToast.custom(() => <Toast {...options} />), 
  {
    show: (message: string, action?: React.MouseEventHandler<HTMLButtonElement>) =>
      sonnerToast.custom(() => <Toast action={action} message={message} variant="default" />),

    warning: (message: string, action?: React.MouseEventHandler<HTMLButtonElement>) =>
      sonnerToast.custom(() => <Toast action={action} message={message} variant="warning" title="Warning..." />),

    success: (message: string, action?: React.MouseEventHandler<HTMLButtonElement>) =>
      sonnerToast.custom(() => <Toast action={action} message={message} variant="success" title="Success..." />),

    error: (message: string, action?: React.MouseEventHandler<HTMLButtonElement>) =>
      sonnerToast.custom(() => <Toast action={action} message={message} variant="error"   title="Error...  " /> ),
  }
);

const Toast = (props: ToastOptions) => {
  const { message, title, action, variant = "default" } = props;
  return (
    <div className={cn(toastVariants({ variant }))}>
      <div className="flex flex-1 flex-col gap-1">
        {title && <p className="text-sm font-medium">{title}</p>}
        <div className="text-sm">{message}</div>
      </div>
      {action && <Button onClick={action} />}
      <Border />
    </div>
  );
};
