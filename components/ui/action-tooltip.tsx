import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ActionToolTipProps {
  children: React.ReactNode;
  label: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "start" | "end";
}

function ActionToolTip({
  children,
  label,
  side,
  align,
  className,
}: ActionToolTipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={cn(className)}>{children}</button>
        </TooltipTrigger>
        <TooltipContent className="text-sm" align={align} side={side}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ActionToolTip;
