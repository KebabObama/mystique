"use client";

import { cva } from "class-variance-authority";
import { toast as sonnerToast } from "sonner";
import { cn } from "@/lib/utils";
import { Border } from "../ui/border";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";

const temp = (message: string, variant: ToastVariant = "default") =>
	sonnerToast.custom((id) => (
		<Toast id={id} title={message} variant={variant} />
	));

export const toast = Object.assign(temp, {
	show: temp,
	success: (message: string) => temp(message, "success"),
	error: (message: string) => temp(message, "error"),
	warning: (message: string) => temp(message, "warning"),
	info: (message: string) => temp(message, "info"),
});

const toastVariants = cva(
	"select-none flex rounded-lg shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4 font-pixelify",
	{
		variants: {
			variant: {
				default: "bg-background text-foreground",
				success:
					"bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
				error: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
				warning:
					"bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
				info: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

const Toast = (props: {
	id: string | number;
	title: string;
	variant: ToastVariant;
}) => {
	const { title, variant } = props;

	return (
		<div className="relative">
			<div className={cn(toastVariants({ variant }))}>
				<p className="text-sm font-medium">{title}</p>
			</div>
			<Border />
		</div>
	);
};
