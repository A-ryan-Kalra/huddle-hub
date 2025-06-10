import React from "react";
import FeaturePopupEffect from "./feature-popup-effect";

function FeaturePages() {
  return (
    <div className="max-w-[1280px] mx-auto flex flex-col gap-y-7 p-2 items-center pt-24 justify-center">
      <div className="flex items-center gap-y-4 flex-col">
        <h1 className="text-xl flex items-center">
          Introducing the{" "}
          <p className="text-indigo-600 ml-1 leading-5 border-b-indigo-600 border-dotted border-b-[2px]">
            Huddle-hub
          </p>
        </h1>
        <h2 className="sm:text-4xl text-2xl font-[1000] text-center">
          Real-Time, collaboration and grow your workspace
          <span className="from-blue-500 to-purple-500 bg-gradient-to-r text-transparent bg-clip-text">
            {" "}
            like a pro
          </span>
        </h2>
      </div>
      <FeaturePopupEffect />
    </div>
  );
}

export default FeaturePages;
