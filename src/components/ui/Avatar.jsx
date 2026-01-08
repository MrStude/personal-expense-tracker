import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef((props, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 overflow-hidden rounded-full", props.className)}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef((props, ref) => (
  <AvatarPrimitive.Image ref={ref} className="h-full w-full" {...props} />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef((props, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className="flex h-full w-full items-center justify-center bg-muted"
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
