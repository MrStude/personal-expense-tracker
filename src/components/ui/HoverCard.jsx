import React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef((props, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    className={cn("rounded-md border bg-popover p-4 shadow-md", props.className)}
    {...props}
  />
));

export { HoverCard, HoverCardTrigger, HoverCardContent };
