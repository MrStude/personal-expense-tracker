import React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function Calendar(props) {
  const { className, ...rest } = props;
  return (
    <DayPicker
      showOutsideDays
      className={cn("p-3", className)}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...rest}
    />
  );
}

export { Calendar };
