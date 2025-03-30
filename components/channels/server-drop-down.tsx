import { ServerSchema } from "@/type";
import { ChevronDown } from "lucide-react";
import React from "react";

interface ServerDropDownProps {
  server: ServerSchema;
}

function ServerDropDown({ server }: ServerDropDownProps) {
  return (
    <div className="px-2 py-1 cursor-pointer hover:bg-zinc-300 duration-300 transition w-fit rounded-md">
      <h1 className="truncate  font-semibold text-lg font-sans flex items-center   ">
        {server?.name.split(" ")?.join("-")} <ChevronDown className="w-4 h-4" />
      </h1>
    </div>
  );
}

export default ServerDropDown;
