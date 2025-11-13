"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Border } from "./border";

const Avatar = ({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) => {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			className={cn("relative flex size-9 shrink-0 rounded-none", className)}
			{...props}
		>
			<Border />
			{props.children}
		</AvatarPrimitive.Root>
	);
};

const AvatarImage = ({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) => {
	return (
		<AvatarPrimitive.Image
			suppressHydrationWarning
			suppressContentEditableWarning
			data-slot="avatar-image"
			className={cn("aspect-square size-full", className)}
			{...props}
		/>
	);
};

const AvatarFallback = ({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn(
				"bg-muted flex size-full items-center justify-center rounded-none",
				className,
			)}
			{...props}
		/>
	);
};

export { Avatar, AvatarFallback, AvatarImage };
