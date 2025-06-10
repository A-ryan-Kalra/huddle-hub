"use client";
import React, { useEffect, useRef, useState } from "react";

function FeaturePopupEffect() {
  const [height, setHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = rect.height;
      const scrollTop = window.scrollY + window.innerHeight - rect.y;
      console.log(window.scrollY + window.innerHeight);
      console.log("=======");
      console.log(rect.top);
      const progress = Math.min(Math.max(scrollTop / totalHeight, 0), 2);

      setHeight(progress * 200); // max height you want the line to grow
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="max-w-[1280px] h-[200vh] relative  ">
      <div
        className="sticky top-52 w-1 bg-black"
        style={{ height: `${height}px` }}
      ></div>
    </div>
  );
}

export default FeaturePopupEffect;
