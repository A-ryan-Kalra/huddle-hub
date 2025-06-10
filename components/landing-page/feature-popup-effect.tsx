"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

function FeaturePopupEffect() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const imgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const line = lineRef.current;
      const imge = imgeRef.current;

      if (!section || !line || !imge) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const triggerPoint = 400;

      if (rect.top < windowHeight - triggerPoint && rect.bottom > 0) {
        const totalScrollable = rect.height;
        const scrolled = Math.min(
          totalScrollable,
          Math.max(100, windowHeight - triggerPoint - rect.top)
        );
        line.style.height = `${scrolled}px`;
        imge.style.height = `${scrolled}px`;
      } else {
        imge.style.height = `${100}px`;
        line.style.height = `${100}px`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="max-w-[1280px] w-full relative mx-auto flex h-full flex-col p-2 items-center pt-28  ">
      <div
        ref={imgeRef}
        className="w-12 h-12 rounded-xl absolute top-0 mx-auto mt-5 transition"
        style={{ height: "100px" }}
      >
        <div className="bg-teal-600 z-10 bottom-0 absolute rounded-full w-12 h-12 flex items-center">
          <img
            className="object-cover aspect-square scale-[200%] mx-auto w-10 h-10"
            alt="logo"
            src={"/icons/maskable-icon.png"}
          />
        </div>
      </div>
      <div
        ref={lineRef}
        className="w-1 bg-indigo-700 rounded-xl absolute top-0 mx-auto mt-5 transition"
        style={{ height: "100px" }}
      ></div>

      <div ref={sectionRef} className="h-[1000px] bg-gray-100">
        Content Section
      </div>
    </div>
  );
}

export default FeaturePopupEffect;
