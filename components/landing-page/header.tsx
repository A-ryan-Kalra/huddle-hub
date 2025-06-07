"use client";
import Image from "next/image";
import React from "react";
import NavbarPage from "./navbar";
import Link from "next/link";

function HeaderPage() {
  return (
    <header className="sticky top-0 max-w-[1280px] mx-auto flex p-2  items-center justify-between">
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
    </header>
  );
}

export default HeaderPage;
