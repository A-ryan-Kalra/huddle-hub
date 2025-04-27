import React from "react";
import { UserButton } from "@clerk/nextjs";

function NavigationSidebar() {
  return (
    <div className="min-w-[70px] flex  flex-col h-full ">
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
