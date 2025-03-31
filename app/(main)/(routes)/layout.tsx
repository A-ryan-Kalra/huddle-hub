import React from "react";

function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="w-full h-[30px]"></div>
      <div className="w-full h-full relative ">{children}</div>
    </div>
  );
}

export default RoutesLayout;
