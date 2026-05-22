import React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef((props, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn("grid gap-2", props.className)} {...props} />
));

const RadioGroupItem = React.forwardRef((props, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn("h-4 w-4 rounded-full border border-primary", props.className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className="h-2.5 w-2.5 fill-current" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));

export { RadioGroup, RadioGroupItem };
