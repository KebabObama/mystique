import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Border } from "../ui/border";
import { Button, type ButtonProps } from "../ui/button";

type FriendSlotProps = { image?: string | null; name?: string } & ButtonProps;

export const FriendSlot = React.forwardRef<HTMLButtonElement, FriendSlotProps>(
  ({ image, name, className, ...props }, ref) => {
    return (
      <Button
        className={cn("group h-10 w-full overflow-visible text-center odd:sm:text-end even:sm:text-start", className)}
        ref={ref}
        {...props}
      >
        <Avatar className="bg-card absolute top-1/2 z-10 hidden size-15 -translate-y-1/2 group-odd:left-0 group-even:right-0 sm:block">
          <Border />
          <AvatarImage src={image as string} />
        </Avatar>
        {name || "Friend"}
      </Button>
    );
  }
);
