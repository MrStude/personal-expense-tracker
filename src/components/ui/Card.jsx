import React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef((props, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card shadow-sm", props.className)} {...props} />
));
Card.displayName = "Card";

export { Card };
