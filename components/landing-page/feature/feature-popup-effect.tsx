"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import FeatureImagePages from "./feature-image";

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

    const observer1 = new IntersectionObserver(
      (entries) => {
        // console.log(entries);
        for (let i = entries.length - 1; i >= 0; i--) {
          const entry = entries[i];

          if (entry.isIntersecting) {
            document
              .querySelectorAll("[data-img-new]")
              .forEach((img) => img.classList.remove("active-slide"));
            console.log(
              "first",
              `${(entry.target as HTMLElement).dataset.imgToShowNew}`
            );
            // console.log(entry.target);
            const img = document.querySelector(
              `img[alt="${(entry.target as HTMLElement).dataset.imgToShowNew}"]`
            );
            // console.log(img);
            img?.classList.add("active-slide");
            break;
          }
        }
      },
      { threshold: 1 }
    );

    document
      .querySelectorAll("[data-img-to-show-new]")
      .forEach((section) => observer1.observe(section));

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="max-w-[1280px] w-full relative mx-auto flex h-full flex-col p-2 items-center pt-[4.5rem]  ">
      <div
        ref={imgeRef}
        className="w-1 border-[3px] border-gray-300 border-dashed rounded-xl h-full absolute top-0 mx-auto mt-5 transition"
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
        className="w-1 bg-indigo-700 rounded-xl absolute top-0 mx-auto mt-5 transition"
        style={{ height: "100px" }}
      ></div>

      <div ref={sectionRef} className="h-[1000px] w-full bg-gray-">
        <div className="bg-white w-1 h-1" data-img-to-show-new="modal"></div>
        <FeatureImagePages
          alt="modal"
          className="active-slide"
          icon="/modal.png"
        />
        <div className="bg-white w-1 h-1" data-img-to-show-new="env-card"></div>
        <FeatureImagePages alt="env-card" icon="/env-card.png" />
        <div className="bg-white w-1 h-1" data-img-to-show-new="deploy"></div>
        <FeatureImagePages alt="deploy" icon="/deploy.png" />
        <div className="bg-white w-1 h-1" data-img-to-show-new="type"></div>
        <FeatureImagePages alt="deploy" icon="/deploy.png" />
      </div>
    </div>
  );
}

export default FeaturePopupEffect;
