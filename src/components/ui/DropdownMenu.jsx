import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef((props, ref) => {
  const { className, inset, children, ...rest } = props;
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex items-center rounded-sm px-2 py-1.5 text-sm focus:bg-accent",
        inset && "pl-8",
        className
      )}
      {...rest}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});

const DropdownMenuContent = React.forwardRef((props, ref) => {
  const { className, sideOffset = 4, ...rest } = props;
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn("min-w-[8rem] rounded-md border bg-popover p-1", className)}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  );
});

const DropdownMenuItem = React.forwardRef((props, ref) => {
  const { className, inset, ...rest } = props;
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn("flex items-center px-2 py-1.5 text-sm", inset && "pl-8", className)}
      {...rest}
    />
  );
});

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup
};
