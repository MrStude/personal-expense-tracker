import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef((props, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={cn("fixed inset-0 bg-black/80", props.className)} {...props} />
));

const DialogContent = React.forwardRef((props, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn("fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6", props.className)}
      {...props}
    >
      {props.children}
      <DialogClose className="absolute right-4 top-4">
        <X className="h-4 w-4" />
      </DialogClose>
    </DialogPrimitive.Content>
  </DialogPortal>
));

export { Dialog, DialogTrigger, DialogContent };
