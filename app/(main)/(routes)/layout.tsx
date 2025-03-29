import { currentProfile } from "@/lib/currentProfile";
import React from "react";

interface RoutesLayoutProps {
  children: React.ReactNode;
}

async function RoutesLayout({ children }: RoutesLayoutProps) {
  return (
    <div className="w-full h-full flex">
      <div className=" h-full w-[300px] border-r-zinc-400 border-r-2 cursor-ew-resize hover:border-r-indigo-600 duration-500 transition-all">
        s
      </div>
      <div>{children}</div>
    </div>
  );
}

export default RoutesLayout;
