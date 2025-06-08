"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import NavbarPage from "./navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";

function HeaderPage() {
  const [isScroll, setIsScroll] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleScroll(e: Event) {
      if (window.scrollY > 0) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    }

    function handleMouseMove(e: Event) {
      const mouseEvent = e instanceof MouseEvent;
      if (mouseEvent) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    document.addEventListener("scroll", handleScroll);
    // document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("scroll", handleScroll);
      //   document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  //   console.log(position);
  return (
    <header
      className={cn(
        "w-full  sticky top-0 transition-all duration-100",
        isScroll && "border-[1px] bg-slate-200/[0.5]"
      )}
    >
      {/* <div
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: "40px",
          height: "40px",
          border: "2px solid #5cbacd",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "transform 0.05s ease-out",
        }}
      /> */}

      <div
        className={cn(
          "max-w-[1280px] mx-auto flex p-2  items-center justify-between"
        )}
      >
        <Link href={"/"} className="flex items-center gap-x-1 sm:gap-x-3">
          <div className="relative sm:w-20 sm:h-20  w-16 h-16">
            <Image
              draggable="false"
              alt="/icons/maskable-icon.png"
              src={"/icons/maskable-icon.png"}
              className="object-cover scale-[150%] sm:scale-[155%] aspect-square"
              fill
            />
          </div>
          <h1 className="font-mono font-semibold text-lg sm:text-2xl">
            Huddle Hub
          </h1>
        </Link>

        <NavbarPage />
      </div>
    </header>
  );
}

export default HeaderPage;
