import Loading from "@/components/ui/loading";
import React, { Suspense } from "react";

function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="w-full h-full flex-1 p-1">{children}</div>
    </div>
  );
}

export default RoutesLayout;
