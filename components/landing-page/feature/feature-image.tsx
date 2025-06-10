import Image from "next/image";
import React from "react";

function FeatureImagePages() {
  console.log(window.innerHeight);
  return (
    <div className="flex items-start justify-between w-full h-full">
      <div
        // style={{ top: `${window.innerHeight}px]` }}
        className={`  h-[500px] sticky top-[400px]  w-[500px]`}
      >
        <Image
          alt="/modal.png"
          className="object-cover"
          fill
          src={"/modal.png"}
        />
      </div>
      <div>
        <h1></h1>
      </div>
    </div>
  );
}

export default FeatureImagePages;
