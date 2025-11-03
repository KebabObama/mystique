import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Border } from "./border";

const buttonVariants = cva(
	"rounded-none active:translate-y-1 transition-transform relative inline-flex items-center justify-center gap-1.5 border-none cursor-pointer",
	{
		variants: {
			variant: {
				default: "bg-card",
				destructive: "bg-destructive",
				outline: "bg-card",
				ghost: "bg-transparent",
				link: "bg-transparent",
			},
			size: {
				sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				lg: "h-12 py-8 px-6 has-[>svg]:px-4 text-2xl",
				icon: "size-9",
			},
		},
		defaultVariants: { variant: "default", size: "default" },
	},
);

type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & { asChild?: boolean };

const Button = ({
	className,
	variant,
	size,
	asChild = false,
	...props
}: ButtonProps) => {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		>
			{props.children}
			{variant !== "ghost" && variant !== "link" && (
				<>
					<Border />
					{variant !== "outline" && (
						<>
							<div className="bg-foreground/10 absolute top-0 left-0 h-1.5 w-full" />
							<div className="bg-foreground/10 absolute top-1.5 left-0 h-1.5 w-1.5" />
							<div className="bg-foreground/10 absolute bottom-0 left-0 h-1.5 w-full" />
							<div className="bg-foreground/10 absolute right-0 bottom-1.5 h-1.5 w-1.5" />
						</>
					)}
				</>
			)}
		</Comp>
	);
};

export { Button, buttonVariants };
