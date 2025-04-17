import React from "react";

function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="w-full flex-1 max-h-[30px]"></div>
      <div className="w-full h-full flex-1 relative border- mb-1">
        {children}
      </div>
    </div>
  );
}

export default RoutesLayout;
