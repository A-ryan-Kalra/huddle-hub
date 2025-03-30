"use client";
import React, { useRef, useState } from "react";

interface ResizeComponentProps {
  children: React.ReactNode;
}

function ResizeComponent({ children }: ResizeComponentProps) {
  const [width, setWidth] = useState(300);
  const isResizing = useRef(false);

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;

    const startX = e.clientX;
    const startWidth = width;

    const handleMove = (event: MouseEvent) => {
      if (!isResizing.current) {
        return null;
      }
      const newWidth = startWidth + (event.clientX - startX);

      setWidth(Math.min(Math.max(newWidth, 150), 2500));
    };

    const handleMouseUp = () => {
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
      className="relative overflow-hidden h-full bg-slate-100"
    >
      {children}
      <div
        onMouseDown={handleDrag}
        className="absolute h-full border-r-zinc-400 w-[5px] opacity-0 hover:opacity-100 duration-500 transition  cursor-ew-resize hover:border-r-indigo-400 hover:border-r-[3px] top-0 right-0"
      ></div>
    </div>
  );
}

export default ResizeComponent;
