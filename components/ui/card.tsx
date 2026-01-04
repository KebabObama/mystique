import { cn } from "@/lib/utils";
import React from "react";
import { Border } from "./border";

type CardProps = React.ComponentPropsWithoutRef<"section">;

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <section className={cn("bg-card relative p-3", className)} {...props}>
      {children}
      <Border />
    </section>
  );
};
