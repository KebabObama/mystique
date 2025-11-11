"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Border } from "./border";

const Context = React.createContext<{
	triggerWidth: number | null;
	setTriggerWidth: (width: number) => void;
}>({ triggerWidth: null, setTriggerWidth: () => {} });

const Body = ({
	children,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) => {
	const [triggerWidth, setTriggerWidth] = React.useState<number | null>(null);
	return (
		<Context.Provider value={{ triggerWidth, setTriggerWidth }}>
			<PopoverPrimitive.Root data-slot="popover" {...props}>
				{children}
			</PopoverPrimitive.Root>
		</Context.Provider>
	);
};

const Trigger = React.forwardRef<
	React.ComponentRef<typeof PopoverPrimitive.Trigger>,
	React.ComponentProps<typeof PopoverPrimitive.Trigger>
>(({ ...props }, ref) => {
	const { setTriggerWidth } = React.useContext(Context);
	const triggerRef = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		const updateWidth = () => {
			if (triggerRef.current) setTriggerWidth(triggerRef.current.offsetWidth);
		};
		updateWidth();
		const resizeObserver = new ResizeObserver(updateWidth);
		if (triggerRef.current) resizeObserver.observe(triggerRef.current);
		return () => {
			resizeObserver.disconnect();
		};
	}, [setTriggerWidth]);

	return (
		<PopoverPrimitive.Trigger
			ref={(node) => {
				triggerRef.current = node;
				if (typeof ref === "function") {
					ref(node);
				} else if (ref) {
					ref.current = node;
				}
			}}
			data-slot="popover-trigger"
			{...props}
		/>
	);
});

const Content = ({
	className,
	align = "center",
	sideOffset = 4,
	children,
	style,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) => {
	const { triggerWidth } = React.useContext(Context);

	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				data-slot="popover-content"
				align={align}
				sideOffset={sideOffset}
				style={{
					width: triggerWidth ? `${triggerWidth}px` : undefined,
					...style,
				}}
				className={cn(
					"bg-card text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-(--radix-popover-content-transform-origin) rounded-none p-6 shadow-md outline-hidden",
					className,
				)}
				{...props}
			>
				{children}

				<Border />
			</PopoverPrimitive.Content>
		</PopoverPrimitive.Portal>
	);
};

const Anchor = ({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) => {
	return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
};

const Popover = Object.assign(Body, { Content, Trigger, Context, Anchor });

export default Popover;
