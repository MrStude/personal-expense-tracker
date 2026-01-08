import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef((props, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full items-center", props.className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full bg-secondary rounded-full">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full bg-background border" />
  </SliderPrimitive.Root>
));

export { Slider };
