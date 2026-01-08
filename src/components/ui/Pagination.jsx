import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }) => (
  <nav className={cn("flex justify-center", className)} {...props} />
);

const PaginationLink = ({ isActive, className, ...props }) => (
  <a
    className={cn("px-3 py-1 rounded-md", isActive && "bg-accent", className)}
    {...props}
  />
);

const PaginationPrevious = (props) => (
  <PaginationLink {...props}>
    <ChevronLeft className="h-4 w-4" />
  </PaginationLink>
);

const PaginationNext = (props) => (
  <PaginationLink {...props}>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);

const PaginationEllipsis = () => (
  <span>
    <MoreHorizontal className="h-4 w-4" />
  </span>
);

export {
  Pagination,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
};
