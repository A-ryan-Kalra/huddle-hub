import React from "react";
import { UserButton } from "@clerk/nextjs";
import { HomeIcon } from "lucide-react";

function NavigationSidebar() {
  return (
    <div className="min-w-[70px] flex items-center flex-col h-full ">
      <div className="w-fit px-1">
        <div className="bg-zinc-300 mt-3 w-fit px-1 rounded-md py-1">
          <HomeIcon className="w-6 h-6 cursor-pointer hover:scale-105 transition" />
        </div>
        <span className="text-xs">Home</span>
      </div>

      <div className=" mt-auto pb-7 w-fit mx-auto">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
}

export default NavigationSidebar;
