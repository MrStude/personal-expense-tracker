import React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

const Drawer = (props) => <DrawerPrimitive.Root {...props} />;
const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerClose = DrawerPrimitive.Close;
const DrawerPortal = DrawerPrimitive.Portal;

const DrawerOverlay = React.forwardRef((props, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 bg-black/80", props.className)} {...props} />
));

const DrawerContent = React.forwardRef((props, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn("fixed bottom-0 inset-x-0 rounded-t-lg bg-background", props.className)}
      {...props}
    />
  </DrawerPortal>
));

export { Drawer, DrawerTrigger, DrawerClose, DrawerContent };
