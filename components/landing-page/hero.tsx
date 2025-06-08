"use client";
import Image from "next/image";
import React, { useState } from "react";

function HeroPage() {
  const [takePriority, setTakePriority] = useState(false);

  return (
    <div className="max-w-[1280px] mx-auto flex flex-col gap-y-7 p-2 md items-center pt-24 justify-center">
      <div className="flex max-sm:flex-col items-center">
        <h1 className="sm:text-5xl text-3xl font-[1000]">
          Connect.Collaborate.
        </h1>
        <span className=" sm:text-5xl text-3xl bg-gradient-to-tr bg-clip-text font-[1000] text-transparent from-teal-700 via-pink-600  to-purple-900">
          Communicate.
        </span>
      </div>
      <p className="tracking-wide text-xl text-zinc-600 text-center">
        Huddle-hub - A real-time communication platform primarily designated for
        workplace ecosystem and collaboration, allowing users to send messages,
        share files and connect with coworkers and clients, engaging in
        one-to-one or one-to-many video/audio chat.
      </p>
      <div className="relative pt-24 h-full w-full">
        <div
          className={`absolute shadow-lg shadow-slate-400   rounded-lg  duration-500 ease-in-out transition-all w-full h-[210px] sm:h-auto overflow-hidden bg-transparent ${
            takePriority
              ? "scale-[1] z-[10] translate-y-8 "
              : "hover:-translate-y-11 scale-[.95] opacity-[.8] -translate-y-8"
          }`}
          onClick={() => setTakePriority((prev) => !prev)}
        >
          <div className="relative w-full h-[75vh] bg-black">
            {/* <video
              src="/jump-to.mp4"
              controls
              className="h-auto w-auto max-w-full"
            >
              Your browser does not support the video tag.
            </video> */}
          </div>
        </div>
        <div
          onClick={() => setTakePriority((prev) => !prev)}
          className={`absolute shadow-lg shadow-slate-400 rounded-xl w-full h-[210px] sm:h-auto overflow-hidden bg-transparent duration-500 ease-in-out transition-all ${
            !takePriority
              ? "scale-[1] z-[10]  translate-y-8"
              : "hover:-translate-y-11 -translate-y-8 opacity-[.8]  scale-[.95]"
          } `}
        >
          <div className="relative w-full h-full">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-auto"
              src={"/workspace-dashboard.png"}
              alt="/workspace-dashboard.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroPage;
