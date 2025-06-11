"use client";
import { cn } from "@/lib/utils";
import { Modak } from "next/font/google";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

function FeatureImagePages({
  icon,
  alt,
  className,
}: {
  icon: string;
  alt: string;
  className?: string;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      const element = imageRef.current;
      const heightElement = heightRef.current;
      const windowHeight = window.innerHeight;
      const imgEl = document.querySelector(`img[alt="${alt}"]`);
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

        if (scrolled > 10 && scrolled < 390) {
          imgEl?.classList.add("show");
          imgEl?.classList.remove("hide");
        } else {
          imgEl?.classList.remove("show");
          imgEl?.classList.add("hide");
        }

        heightElement.style.height = `${scrolled}px`;
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={imageRef}
      className="flex items-start relative justify-between  overflow-hidde bg w-full h-[400px]"
    >
      <div className="absolute top-0 rounded-full   bg-white py-3  left-[50%] translate-x-[-50%] w-3 h-3  ">
        <div
          className={`relative rounded-full border-[2px] bg-white top-[50%]  left-[50%] translate-x-[-50%] translate-y-[-50%]  border-indigo-400  w-3 h-3`}
        ></div>
      </div>
      <div ref={heightRef} className="absolute top-0  ">
        <div
          className={cn(`w-[600px] h-[500px] absolute top-full `, className)}
        >
          <img
            className="object-cover aspect-square w-[600px] h-full"
            alt={alt}
            src={icon}
            data-img-new
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
