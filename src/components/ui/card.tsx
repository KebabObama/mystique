import type * as React from "react";

import { cn } from "@/lib/utils";
import { Border } from "./border";

const Body = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground relative flex w-auto flex-col gap-6 rounded-none border-0 py-6 shadow-sm",
        className
      )}
      data-slot="card"
      {...props}
    >
      <Border />
      {props.children}
    </div>
  );
};

const Header = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      data-slot="card-header"
      {...props}
    />
  );
};

const Title = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("leading-none font-semibold", className)}
      data-slot="card-title"
      {...props}
    />
  );
};

const Description = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="card-description"
      {...props}
    />
  );
};

const Action = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      data-slot="card-action"
      {...props}
    />
  );
};

const Content = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={cn("px-6", className)} data-slot="card-content" {...props} />;
};

const Footer = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      data-slot="card-footer"
      {...props}
    />
  );
};

export default Object.assign(Body, { Header, Title, Description, Action, Content, Footer });
