import React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuContent = React.forwardRef((props, ref) => (
  <ContextMenuPrimitive.Content
    ref={ref}
    className={cn("rounded-md border bg-popover p-1", props.className)}
    {...props}
  />
));

const ContextMenuItem = React.forwardRef((props, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn("px-2 py-1.5 text-sm", props.className)}
    {...props}
  />
));

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem };
