import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef((props, ref) => (
  <nav ref={ref} aria-label="breadcrumb" {...props} />
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbLink = React.forwardRef((props, ref) => {
  const { asChild, className, ...rest } = props;
  const Comp = asChild ? Slot : "a";
  return <Comp ref={ref} className={cn("hover:text-foreground", className)} {...rest} />;
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbSeparator = () => <ChevronRight className="h-4 w-4" />;
const BreadcrumbEllipsis = () => <MoreHorizontal className="h-4 w-4" />;

export { Breadcrumb, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbEllipsis };
