"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Refresh({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  return (
    <div
      onClick={() => {
        setIsloading(true);
        setTimeout(() => {
          router.refresh();
          setIsloading(false);
        }, 1000);
      }}
      className={`${isLoading && "animate-spin"} `}
    >
      {children}
    </div>
  );
}

export default Refresh;
