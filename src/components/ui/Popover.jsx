import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef((props, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      className={cn("w-72 rounded-md border bg-popover p-4 shadow-md", props.className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

export { Popover, PopoverTrigger, PopoverContent };
