import { X, XCircle } from "lucide-react";
import React from "react";

function ChatThreads() {
  return (
    <div className="w-full h-full p-2">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Thread</h1>
        <button className="p-1 hover:bg-zinc-200 transition-all rounded-full">
          <XCircle className=" w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatThreads;
