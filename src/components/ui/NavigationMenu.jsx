import React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationMenuTriggerStyle = cva(
  "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent"
);

const NavigationMenu = React.forwardRef((props, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative flex items-center", props.className)}
    {...props}
  >
    {props.children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));

const NavigationMenuList = React.forwardRef((props, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("flex space-x-1", props.className)}
    {...props}
  />
));

const NavigationMenuTrigger = React.forwardRef((props, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), props.className)}
    {...props}
  >
    {props.children}
    <ChevronDown className="ml-1 h-3 w-3" />
  </NavigationMenuPrimitive.Trigger>
));

const NavigationMenuContent = React.forwardRef((props, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn("absolute bg-popover border rounded-md", props.className)}
    {...props}
  />
));

const NavigationMenuViewport = React.forwardRef((props, ref) => (
  <NavigationMenuPrimitive.Viewport
    ref={ref}
    className={cn("absolute top-full mt-2 rounded-md border bg-popover", props.className)}
    {...props}
  />
));

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle
};
