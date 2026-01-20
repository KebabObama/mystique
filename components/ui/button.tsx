import { Border } from "@/components/ui/border";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const buttonVariants = cva(
  "rounded-none active:translate-y-1 transition-transform relative inline-flex items-center justify-center gap-1.5 border-none cursor-pointer disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-card",
        destructive: "bg-destructive",
        outline: "bg-card",
        ghost: "bg-transparent",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        default: "h-9 px-4 py-2 has-[>svg]:px-3 text-lg font-semibold",
        lg: "h-12 py-8 px-6 has-[>svg]:px-4 text-2xl font-bold",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

const Button = ({ className, variant, size, asChild = false, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {props.children}
      {variant !== "ghost" && (
        <>
          <Border />
          {variant !== "outline" && (
            <>
              <div className="bg-border/30 absolute top-0 left-0 h-1.5 w-full" />
              <div className="bg-border/30 absolute top-1.5 left-0 h-1.5 w-1.5" />
              <div className="bg-border/30 absolute bottom-0 left-0 h-1.5 w-full" />
              <div className="bg-border/30 absolute right-0 bottom-1.5 h-1.5 w-1.5" />
            </>
          )}
        </>
      )}
    </Comp>
  );
};

export { Button, type ButtonProps };
