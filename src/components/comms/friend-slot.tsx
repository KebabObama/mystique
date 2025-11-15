import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Border } from "../ui/border";

type FriendSlotProps = {
  image?: string | null;
  name?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const FriendSlot = React.forwardRef<HTMLButtonElement, FriendSlotProps>(
  ({ image, name, className, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        className={cn(
          "relative h-10 w-full overflow-visible px-3 text-center sm:text-end",
          className
        )}
        {...props}
      >
        <Border />
        <Avatar className="bg-card absolute top-1/2 left-0 hidden w-13 -translate-y-1/2 sm:block">
          <Border />
          <AvatarImage src={image as string} />
        </Avatar>
        {name || "Friend"}
      </button>
    );
  }
);
