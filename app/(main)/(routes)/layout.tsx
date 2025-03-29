"use client";

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
    console.log(width);
    let number = 0;
    const handleMove = (event: MouseEvent) => {
      if (!isResizing.current) {
        return null;
      }
      const newWidth =
        startWidth +
        (event.clientX - startX) * ((number * 0.9) / (number * 0.5));
      number++;
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
    <div className="w-full h-full flex">
      <div className="min-w-[70px] h-full "></div>
      <div className="flex w-full h-full pr-1 pb-2 rounded-2xl  overflow-hidden">
        <div style={{ width }} className="relative  h-full bg-slate-100">
          <div
            onMouseDown={handleDrag}
            className="absolute h-full border-r-zinc-400 w-[5px] opacity-0 hover:opacity-100 duration-500 transition  cursor-ew-resize hover:border-r-indigo-400 hover:border-r-[3px] top-0 right-0"
          ></div>
        </div>
        <div className="bg-slate-200 w-full h-full">{children}</div>
      </div>
    </div>
  );
}

export default RoutesLayout;
