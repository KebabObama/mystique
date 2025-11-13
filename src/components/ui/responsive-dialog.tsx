"use client";

import type React from "react";
import Dialog from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

type ResponsiveDialogProps = {
	trigger: React.ReactNode;
	title: string;
	description?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

export default ({
	trigger,
	title,
	description,
	children,
	footer,
	open,
	onOpenChange,
}: ResponsiveDialogProps) => {
	const isMobile = useIsMobile();

	if (isMobile)
		return (
			<Drawer open={open} onOpenChange={onOpenChange}>
				<DrawerTrigger asChild>{trigger}</DrawerTrigger>
				<DrawerContent className="pb-4.5">
					<DrawerHeader>
						<DrawerTitle>{title}</DrawerTitle>
						{description && (
							<DrawerDescription>{description}</DrawerDescription>
						)}
					</DrawerHeader>
					<div className="px-4">{children}</div>
					{footer && <DrawerFooter>{footer}</DrawerFooter>}
				</DrawerContent>
			</Drawer>
		);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
			<Dialog.Content className="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>{title}</Dialog.Title>
					{description && (
						<Dialog.Description>{description}</Dialog.Description>
					)}
				</Dialog.Header>
				<div className="grid gap-4 py-4">{children}</div>
				{footer && <Dialog.Footer>{footer}</Dialog.Footer>}
			</Dialog.Content>
		</Dialog>
	);
};
