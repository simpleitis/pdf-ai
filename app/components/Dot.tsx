import React from "react";
import { cn } from "@/lib/utils"; // Adjust path to your cn utility

type DotProps = {
  color?: string;
  className?: string;
};

export default function Dot({ color, className }: DotProps) {
  return (
    <span
      className={cn(
        "w-2 h-2 rounded-full shrink-0",
        color || "bg-green-500",
        className
      )}
    />
  );
}
