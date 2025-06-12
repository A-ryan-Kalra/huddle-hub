"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import FeatureImagePages from "./feature-image";
import { features } from "@/lib/constant-features";

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

    const observer = new IntersectionObserver(
      (entries) => {
        // console.log(entries);
        for (let i = entries.length - 1; i >= 0; i--) {
          const entry = entries[i];

          if (!entry.isIntersecting) {
            document.querySelectorAll("[data-img-new]").forEach((img) => {
              img.classList.toggle("hide");
            });

            break;
          }
        }
      },
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className=" w-full relative mx-auto flex h-full flex-col p-2 items-center pt-[4.5rem]  ">
      <div
        ref={imgeRef}
        className="w-1 border-[2px] border-gray-300 border-dashed rounded-xl h-full absolute top-0 mx-auto mt-5 transition"
      ></div>
      <div
        ref={imgeRef}
        className="w-[50px]  h-[50px] rounded-xl absolute top-0 mx-auto mt-5 transition"
        style={{ height: "100px" }}
      >
        <div className="border-[2px] border-teal-600 z-10 bottom-0 absolute bg-white rounded-full w-[50px] h-[50px] flex items-center">
          <img
            className="object-cover aspect-square scale-[200%] mx-auto w-10 h-10"
            alt="logo"
            src={"/icons/maskable-icon.png"}
          />
        </div>
      </div>
      <div
        ref={lineRef}
        className="w-[4px] bg-indigo-700  rounded-xl absolute top-0 mx-auto mt-5 transition"
        style={{ height: "100px" }}
      ></div>

      <div ref={sectionRef} className="h-full w-full bg-gray-">
        {features?.map((feature, index) => (
          <FeatureImagePages
            key={index}
            title={feature.title}
            description={feature.description}
            alt={feature.alt}
            // className="show"
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default FeaturePopupEffect;
