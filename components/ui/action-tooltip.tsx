import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Button } from "./button";

interface ActionToolTipProps {
  children: React.ReactNode;
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "start" | "end";
}

function ActionToolTip({ children, label, side, align }: ActionToolTipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button>{children}</button>
        </TooltipTrigger>
        <TooltipContent align={align} className="text-sm" side={side}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ActionToolTip;
