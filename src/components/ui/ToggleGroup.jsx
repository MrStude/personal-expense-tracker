import React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
});

const ToggleGroup = React.forwardRef((props, ref) => {
  const { className, variant, size, children, ...rest } = props;
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn("flex items-center gap-1", className)}
      {...rest}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

const ToggleGroupItem = React.forwardRef((props, ref) => {
  const { className, children, variant, size, ...rest } = props;
  const ctx = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: ctx.variant || variant,
          size: ctx.size || size,
        }),
        className
      )}
      {...rest}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

export { ToggleGroup, ToggleGroupItem };
