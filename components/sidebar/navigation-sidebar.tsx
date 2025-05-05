import React from "react";
import { UserButton } from "@clerk/nextjs";
import { HomeIcon } from "lucide-react";
import { Notification } from "../ui/notification";

interface NavigationSidebarProps {
  currentMemberId: string;
}
function NavigationSidebar({ currentMemberId }: NavigationSidebarProps) {
  return (
    <div className="min-w-[70px] flex gap-y-3 items-center flex-col h-full ">
      <div className="w-fit px-1">
        <div className="bg-zinc-200 mt-3 w-fit px-1 rounded-md py-1">
          <HomeIcon className="w-6 h-6 cursor-pointer hover:scale-105 transition" />
        </div>
        <span className="text-xs">Home</span>
      </div>
      <div className="">
        <Notification currentMemberId={currentMemberId} />
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
