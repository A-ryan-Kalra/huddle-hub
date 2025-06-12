"use client";
import { cn } from "@/lib/utils";
import { Modak } from "next/font/google";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

function FeatureImagePages({
  icon,
  alt,
  className,
  description,
  title,
}: {
  icon: string;
  alt: string;
  className?: string;
  title: string;
  description: string;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);
  const [isChecked, setIsChecked] = useState(false);
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

        if (scrolled < 399) {
          heightElement.style.height = `${scrolled}px`;
          imgEl?.classList.add("show");
          imgEl?.classList.remove("hide");
        } else {
          imgEl?.classList.remove("show");
          imgEl?.classList.add("hide");
        }
        setIsChecked(true);
      } else {
        imgEl?.classList.remove("show");
        imgEl?.classList.add("hide");
        setIsChecked(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isChecked]);

  return (
    <div
      ref={imageRef}
      className="flex items-start relative justify-between overflow-hidde   w-full h-[400px]"
    >
      <>
        <div
          className={`absolute top-0 rounded-full bg-white left-[50%] translate-x-[-50%] w-3 h-3   ${
            isChecked
              ? "border-indigo-600  border-[3px] px-2 py-2"
              : "bg-white py-3"
          }`}
        >
          <div
            className={`relative rounded-full border-[2px]  top-[50%]  left-[50%] translate-x-[-50%] translate-y-[-50%] ${
              isChecked ? "bg-indigo-600" : "bg-white"
            } border-indigo-400  w-3 h-3`}
          ></div>
        </div>
        <div ref={heightRef} className="absolute top-0">
          <div
            className={cn(
              `sm:w-[600px]  w-[200px] h-[200px] sm:h-[500px] absolute top-full `,
              className
            )}
          >
            <img
              className="object-cover aspect-square w-[600px] h-full"
              alt={alt}
              src={icon}
              data-img-new
            />
          </div>
        </div>
      </>
      <div className="  w-full flex  justify-between h-full">
        <div className="flex-1 w-full h-full"></div>
        <div className="flex-1 flex gap-y-5 flex-col  px-2">
          <h1 className="mt-2 text-left text-2xl ml-2 sm:ml-10  font-extrabold sm:text-4xl">
            <span
              className={`${
                isChecked
                  ? "from-purple-500 to-blue-500"
                  : "from-slate-500 to-purple-300"
              }  bg-gradient-to-r text-transparent bg-clip-text`}
            >
              {title}
            </span>
          </h1>
          <p className=" sm:text-xl max-sm:text-sm w-full text-left sm:px-5 ml-5 py-2 px-2 font-sans text-zinc-700">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeatureImagePages;
