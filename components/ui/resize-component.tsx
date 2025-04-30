"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

interface ResizeComponentProps {
  children: React.ReactNode;
  type?: "openThread";
}

function ResizeComponent({ children, type }: ResizeComponentProps) {
  const [width, setWidth] = useState(type !== "openThread" ? 325 : 425);
  const isResizing = useRef(false);

  const verticalBar = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;

    const startX = e.clientX;
    const startWidth = width;
    if (verticalBar.current) {
      verticalBar.current.style.borderRight = "3px #818cf8 solid";
    }

    const handleMove = (event: MouseEvent) => {
      if (!isResizing.current) {
        return null;
      }
      const newWidth =
        type === "openThread"
          ? startWidth + (startX - event.clientX)
          : startWidth + (event.clientX - startX);
      //  const newWidth = startWidth + (startX - event.clientX);
      setWidth(
        Math.min(Math.max(newWidth, 250), type === "openThread" ? 600 : 1400)
      );
    };

    const handleMouseUp = () => {
      if (verticalBar.current) {
        verticalBar.current.style.borderRight = "";
      }

      isResizing.current = false;
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      style={{ width }}
      className={cn(
        "relative max-md:hidden overflow-hidden h-full bg-slate-100"
      )}
    >
      <div
        onMouseDown={handleDrag}
        ref={verticalBar}
        className={cn(
          "absolute h-full border-r-zinc-400 w-[8px] active:opacity-100 opacity-0 hover:opacity-100 duration-500 transition  cursor-ew-resize hover:border-r-indigo-400 hover:border-r-[3px] top-0 right-0",
          type === "openThread" && "!left-0"
        )}
      />
      {children}
    </div>
  );
}

export default ResizeComponent;
