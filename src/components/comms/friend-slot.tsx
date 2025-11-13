import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { cn } from "@/lib/utils";
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
			<div ref={ref} className={cn("flex flex-row h-10 relative", className)}>
				<Border />
				<Avatar className="size-11.5">
					<AvatarImage src={image as string} />
				</Avatar>
				<div className="w-1.5 h-10 bg-foreground dark:bg-ring" />
				<div className="flex flex-col text-right w-full py-0.5 pr-3 items-end justify-center">
					<span className="font-medium">{name || "Unknown User"}</span>
					<span className="text-sm text-muted-foreground">{email || ""}</span>
				</div>
			</div>
		);
	},
);
