import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Border } from "../ui/border";

type FriendSlotProps = {
  image?: string | null;
  name?: string;
  email?: string;
  className?: string;
};

export const FriendSlot = React.forwardRef<HTMLDivElement, FriendSlotProps>(
  ({ image, name, email, className }, ref) => {
    return (
      <div ref={ref} className={cn("relative flex h-10 flex-row", className)}>
        <Border />
        <Avatar className="size-11.5">
          <AvatarImage src={image as string} />
        </Avatar>
        <div className="bg-foreground dark:bg-ring h-10 w-1.5" />
        <div className="flex w-full flex-col items-end justify-center py-0.5 pr-3 text-right">
          <span className="font-medium">{name || "Unknown User"}</span>
          <span className="text-muted-foreground text-sm">{email || ""}</span>
        </div>
      </div>
    );
  }
);
