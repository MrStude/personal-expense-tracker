import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef((props, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex h-6 w-11 items-center rounded-full bg-input data-[state=checked]:bg-primary",
      props.className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="block h-5 w-5 rounded-full bg-background transition-transform data-[state=checked]:translate-x-5" />
  </SwitchPrimitive.Root>
));

export { Switch };
