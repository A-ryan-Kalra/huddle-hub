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
  onClick?: () => void;
}

function ActionToolTip({
  children,
  label,
  side,
  align,
  className,
  onClick,
}: ActionToolTipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={onClick} asChild>
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
