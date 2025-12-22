"use client";

import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

export const Slider = ({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) => {
  const thumbValues = React.useMemo(() => {
    const target = value ?? defaultValue ?? [min];
    return Array.isArray(target) ? target : [target];
  }, [value, defaultValue, min]);

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      value={value}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "bg-muted relative grow overflow-hidden data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
        data-slot="slider-track"
      >
        <SliderPrimitive.Range
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
          data-slot="slider-range"
        />
      </SliderPrimitive.Track>

      {/* We only map the thumbs if mounted, or we render a single thumb 
          by default to match the most common server-side expectation.
      */}
      {thumbValues.map((_, index) => (
        <SliderPrimitive.Thumb
          key={`thumb-${index}`}
          className="bg-foreground border-primary block size-3 shrink-0 transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4"
          data-slot="slider-thumb"
        />
      ))}
    </SliderPrimitive.Root>
  );
};
