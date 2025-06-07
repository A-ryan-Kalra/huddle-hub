import React from "react";
import { Button } from "../ui/button";
import { SignInButton } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";

function NavbarPage() {
  return (
    <nav>
      <button className="bg-[#A2E6CB] group flex items-center text-teal-800 font-semibold text-lg px-4 py-1 rounded-[23px]">
        <SignInButton />

        <span className="relative ml-[6px] inline-block h-[16px] w-[16px]">
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-[4px] w-[2px] origin-right transition-all group-hover:w-[10px]"
            preserveAspectRatio="none"
          >
            <path
              d="M 1 8 L 9 8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="absolute left-[-4px] top-0 duration-150 group-hover:translate-x-[8px]"
          >
            <path
              d="m6 12 4-4-4-4"
              stroke="currentColor"
              className="icon-dark"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
      </button>
    </nav>
  );
}

export default NavbarPage;
