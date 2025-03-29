"use client";
import { currentProfile } from "@/lib/currentProfile";
import React, { useRef, useState } from "react";

interface RoutesLayoutProps {
  children: React.ReactNode;
}

function RoutesLayout({ children }: RoutesLayoutProps) {
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
      setWidth(Math.max(newWidth, 150));
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
    <div className="w-full h-full flex">
      <div style={{ width }} className="relative h-full bg-slate-100">
        Resizable Content Resizable Content
        <div
          onMouseDown={handleDrag}
          className="absolute h-full border-r-zinc-400 w-[5px] opacity-0 hover:opacity-100 duration-500 transition  cursor-ew-resize hover:border-r-indigo-400 hover:border-r-[3px] top-0 right-0"
        ></div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default RoutesLayout;
