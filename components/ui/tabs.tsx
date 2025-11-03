"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type * as React from "react";
import { cn } from "@/lib/utils";

const Body = ({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) => {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			className={cn("flex flex-col gap-2", className)}
			{...props}
		/>
	);
};

const List = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => {
	return (
		<div className="relative">
			<TabsPrimitive.List
				data-slot="tabs-list"
				className={cn(
					"bg-card text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-none p-[3px]",
					className,
				)}
				{...props}
			>
				{children}
			</TabsPrimitive.List>

			<div className="bg-foreground dark:bg-ring absolute -top-1.5 left-1.5 h-1.5 w-1/2" />
			<div className="bg-foreground dark:bg-ring absolute -top-1.5 right-1.5 h-1.5 w-1/2" />
			<div className="bg-foreground dark:bg-ring absolute -bottom-1.5 left-1.5 h-1.5 w-1/2" />
			<div className="bg-foreground dark:bg-ring absolute right-1.5 -bottom-1.5 h-1.5 w-1/2" />
			<div className="bg-foreground dark:bg-ring absolute top-0 left-0 size-1.5" />
			<div className="bg-foreground dark:bg-ring absolute top-0 right-0 size-1.5" />
			<div className="bg-foreground dark:bg-ring absolute bottom-0 left-0 size-1.5" />
			<div className="bg-foreground dark:bg-ring absolute right-0 bottom-0 size-1.5" />
			<div className="bg-foreground dark:bg-ring absolute top-1.5 -left-1.5 h-[calc(100%-12px)] w-1.5" />
			<div className="bg-foreground dark:bg-ring absolute top-1.5 -right-1.5 h-[calc(100%-12px)] w-1.5" />
		</div>
	);
};

const Trigger = ({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				"data-[state=active]:bg-accent data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-none border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	);
};

const Content = ({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => {
	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			className={cn("flex-1 outline-none", className)}
			{...props}
		/>
	);
};

export default Object.assign(Body, { List, Content, Trigger });
