"use client";
import Image from "next/image";
import React, { useState } from "react";

function HeroPage() {
  const [takePriority, setTakePriority] = useState(false);

  return (
    <div className="max-w-[1280px] mx-auto  flex flex-col gap-y-7 p-2 items-center pt-24 justify-center">
      <div className="flex max-md:flex-col items-center">
        <h1 className="sm:text-5xl text-3xl font-[1000]">
          Connect.Collaborate.
        </h1>
        <span className=" sm:text-5xl text-3xl bg-gradient-to-r bg-clip-text font-[1000] text-transparent from-teal-700 to-pink-600  via-purple-900">
          Communicate.
        </span>
      </div>
      <p className="tracking-wide text-xl text-zinc-600 text-center">
        Huddle-hub - A real-time communication platform primarily designated for
        workplace ecosystem and collaboration, allowing users to send messages,
        share files and connect with coworkers and clients, engaging in
        one-to-one or one-to-many video/audio chat.
      </p>
      <div className="relative pt-12 sm:pt-24 h-full max-sm:h-[400px] sm:h-[700px] lg:h-[1000px]  w-full mt-10">
        <div
          className={`absolute shadow-lg shadow-slate-400   rounded-lg  duration-700 ease-in-out transition-all w-full h-auto sm:h-auto overflow-hidden bg-transparent ${
            takePriority
              ? "scale-[1] z-[10] translate-y-4 sm:translate-y-8"
              : "md:hover:-translate-y-14 scale-[.95] opacity-[.8] -translate-y-1 sm:-translate-y-7"
          }`}
          onClick={() => setTakePriority((prev) => !prev)}
        >
          <div className="relative w-full h-full">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-auto"
              src={"/feature-template.png"}
              alt="/feature-template.png"
            />
          </div>
        </div>
        <div
          onClick={() => setTakePriority((prev) => !prev)}
          className={`absolute shadow-lg shadow-slate-400 rounded-xl w-full h-auto sm:h-auto overflow-hidden bg-transparent duration-700 ease-in-out transition-all ${
            !takePriority
              ? "scale-[1] z-[10]  translate-y-4 sm:translate-y-8"
              : "md:hover:-translate-y-14 -translate-y-1 sm:-translate-y-7 opacity-[.8]  scale-[.95]"
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
