import { Loader } from "lucide-react";
import Image from "next/image";
import React from "react";

function Loading() {
  return (
    <div className="flex flex-col h-[100dvh] items-center justify-center bg-gray-100">
      <div className="relative w-[350px] h-[300px] ">
        <Image
          alt="img"
          className="object-cover aspect-square"
          src={"/icons/maskable-icon.png"}
          fill
        />
      </div>
      <div className="mx-auto  gap-x-1 flex items-center justify-center">
        <div className="dots ">
          <span className="dot dot1 bg-black w-1 h-5"></span>
          <span className="dot dot2 bg-black w-1 h-5"></span>
          <span className="dot dot3 bg-black w-1 h-5"></span>
        </div>
      </div>
    </div>
  );
}

export default Loading;
