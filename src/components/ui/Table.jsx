import React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef((props, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full text-sm", props.className)} {...props} />
  </div>
));

const TableHeader = React.forwardRef((props, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", props.className)} {...props} />
));

const TableBody = React.forwardRef((props, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", props.className)} {...props} />
));

const TableRow = React.forwardRef((props, ref) => (
  <tr ref={ref} className={cn("border-b hover:bg-muted/50", props.className)} {...props} />
));

const TableHead = React.forwardRef((props, ref) => (
  <th ref={ref} className={cn("px-4 py-2 text-left font-medium", props.className)} {...props} />
));

const TableCell = React.forwardRef((props, ref) => (
  <td ref={ref} className={cn("p-4", props.className)} {...props} />
));

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
