import React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { cn } from "@/lib/utils";

const Menubar = React.forwardRef((props, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn("flex h-10 items-center rounded-md border bg-background p-1", props.className)}
    {...props}
  />
));

const MenubarTrigger = React.forwardRef((props, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn("px-3 py-1.5 text-sm hover:bg-accent rounded-sm", props.className)}
    {...props}
  />
));

const MenubarContent = React.forwardRef((props, ref) => (
  <MenubarPrimitive.Content
    ref={ref}
    className={cn("rounded-md border bg-popover p-1", props.className)}
    {...props}
  />
));

export { Menubar, MenubarTrigger, MenubarContent };
