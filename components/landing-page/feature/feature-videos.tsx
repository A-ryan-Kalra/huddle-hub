"use client";
import { cn } from "@/lib/utils";
import { Modak } from "next/font/google";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface FeatureVideoProps {
  icon: string;
  alt: string;
  className?: string;
  title: string;
  description: string;
}
function FeatureVideos({
  icon,
  alt,
  className,
  description,
  title,
}: FeatureVideoProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);
  const showRef = useRef<HTMLDivElement>(null);
  const [isChecked, setIsChecked] = useState(false);
  const controlVideoRef = useRef<HTMLVideoElement>(null);
  const controlVideoRefMobile = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function handleScroll() {
      const element = imageRef.current;
      const heightElement = heightRef.current;
      const showImgElement = showRef.current;
      const windowHeight = window.innerHeight;
      const video = controlVideoRef.current;
      const videoMobile = controlVideoRefMobile.current;

      const imgEl = document.querySelector(`video[data-alt="${alt}"]`);
      if (!element || !heightElement) {
        return;
      }
      const rect = element.getBoundingClientRect();
      const targetPoint = 500;

      if (rect.top - 10 < windowHeight - targetPoint && rect.bottom > 0) {
        setIsChecked(true);
        const totalScrollable = rect.height;
        const scrolled = Math.min(
          totalScrollable,
          Math.max(0, windowHeight - targetPoint - rect.top)
        );

        if (scrolled < 389) {
          if (video && window.innerWidth >= 1024) {
            try {
              await video.play(); // Wait until it's safe to play
            } catch (err) {
              console.error("Playback failed:", err);
            }
          }
          if (videoMobile) {
            try {
              await videoMobile.play(); // Wait until it's safe to play
            } catch (err) {
              console.error("Playback failed:", err);
            }
          }
          if (window.innerWidth >= 1024) {
            // heightElement.style.height = `${scrolled}px`;
            // heightElement.style.transform = `translateY(${scrolled}px)`;

            heightElement.animate(
              { transform: `translateY(${scrolled}px)` },
              { duration: 0, easing: "ease-in-out", fill: "forwards" }
            );
          }

          imgEl?.classList.add("show");
          showImgElement?.classList.add("show");
          imgEl?.classList.remove("hide");
          showImgElement?.classList.remove("hide");
        } else {
          imgEl?.classList.remove("show");
          showImgElement?.classList.remove("show");
          imgEl?.classList.add("hide");
          showImgElement?.classList.add("hide");
          if (video && window.innerWidth >= 1024) {
            video.pause();
            video.currentTime = 0;
          }
          if (videoMobile) {
            videoMobile.pause();
            videoMobile.currentTime = 0;
          }
        }
      } else {
        imgEl?.classList.remove("show");
        showImgElement?.classList.remove("show");
        imgEl?.classList.add("hide");
        showImgElement?.classList.add("hide");
        setIsChecked(false);
        if (video && window.innerWidth >= 1024) {
          video.pause();
          video.currentTime = 0;
        }
        if (videoMobile) {
          videoMobile.pause();
          videoMobile.currentTime = 0;
        }
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
      className={`flex items-start relative lg:justify-between overflow-hidde  w-full ${
        alt !== "server" ? "h-[400px]" : "h-full"
      } `}
    >
      <>
        <div
          className={`absolute top-1 translate-x-[2%] rounded-full bg-white lg:left-[50%] lg:translate-x-[-50%] w-2 h-2   ${
            isChecked
              ? "border-indigo-600  border-[2px] px-2 py-2 max-sm:-left-[2%] -left-[1%]"
              : "bg-white py-3 -left-0.5"
          }`}
        >
          <div
            className={`relative rounded-full border-[2px] top-[50%] lg:left-[50%] lg:translate-x-[-50%] translate-y-[-50%] ${
              isChecked
                ? "bg-indigo-600 translate-x-[-50%]"
                : "bg-white max-lg:translate-x-[-10%]"
            } border-indigo-400  w-3 h-3`}
          ></div>
        </div>
        <div ref={heightRef} className="absolute top-0 max-lg:hidden">
          <div
            className={cn(
              `xl:w-[600px] max-xl:w-[490px] w-[200px] rounded-md max-xl:-left-2 2xl:-left-7 h-[200px] lg:h-[340px] absolute lg:top-full `,
              className
            )}
          >
            <video
              className="object-cover object-top z-10 shadow-md shadow-slate-400 rounded-md overflow-hidden aspect-square w-full h-full"
              data-alt={alt}
              ref={controlVideoRef}
              autoPlay
              loop
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture={true}
              muted
              src={icon}
              data-img-new
            />
          </div>
        </div>
      </>
      <div className="  w-full flex  max-lg:flex-col-reverse  lg:justify-between h-full">
        <div className="flex-1 w-full  h-full relative">
          <div ref={showRef} className="relative w-full h-full lg:hidden">
            <div
              className={cn(
                `  rounded-md relative left-1  md:w-[400px] max-lg:w-full max-lg:mx-auto max-sm:w-full h-[200px] p-2 lg:top-full `,
                className
              )}
            >
              <video
                className="object-cover show object-top z-10 shadow-md shadow-slate-400 rounded-md overflow-hidden aspect-square w-full h-full"
                data-alt={alt}
                ref={controlVideoRefMobile}
                controlsList="nodownload noremoteplayback noplaybackrate"
                disablePictureInPicture={true}
                autoPlay
                loop
                muted
                src={icon}
                data-img-new
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex lg:gap-y-5 gap-y-2 flex-col max-sm:ml-3 px-2">
          <h1 className=" max-sm:mt-3 text-left text-2xl ml-2 sm:ml-10  font-extrabold sm:text-3xl">
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
          <p className=" sm:text-lg max-sm:text-sm w-full text-left sm:px-5 sm:ml-5 py-2 px-2 font-sans text-zinc-700">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeatureVideos;
