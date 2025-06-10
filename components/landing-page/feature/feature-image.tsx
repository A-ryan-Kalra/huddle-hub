"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

function FeatureImagePages() {
  const imageRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    function handleScroll() {
      const element = imageRef.current;
      const heightElement = heightRef.current;
      const windowHeight = window.innerHeight;

      if (!element || !heightElement) {
        return;
      }
      const rect = element.getBoundingClientRect();
      const targetPoint = 500;
      if (rect.top < windowHeight - targetPoint && rect.bottom > 0) {
        const totalScrollable = rect.height;
        const scrolled = Math.min(
          totalScrollable,
          Math.max(0, windowHeight - targetPoint - rect.top)
        );
        heightElement.style.height = `${scrolled}px`;
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //   console.log(scrollProgress);
  return (
    <div
      ref={imageRef}
      className="flex items-start relative justify-between w-full h-full"
    >
      <div ref={heightRef} className="absolute top-0  ">
        <div className={`w-[600px] h-[500px] absolute top-full `}>
          <img
            className="object-cover aspect-square w-[600px] h-full"
            alt="/modal.png"
            src={"/modal.png"}
          />
        </div>
      </div>
      <div>
        <h1></h1>
      </div>
    </div>
  );
}

export default FeatureImagePages;
