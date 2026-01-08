import React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const Command = React.forwardRef((props, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn("flex h-full w-full flex-col rounded-md", props.className)}
    {...props}
  />
));

const CommandInput = React.forwardRef((props, ref) => (
  <div className="flex items-center border-b px-3">
    <Search className="mr-2 h-4 w-4 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn("h-11 w-full bg-transparent outline-none", props.className)}
      {...props}
    />
  </div>
));

export { Command, CommandInput };
