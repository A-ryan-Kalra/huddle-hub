"use client";
import ChatThreads from "@/components/chat/chat-threads";
import ResizeComponent from "@/components/ui/resize-component";
import { useModal } from "@/hooks/use-modal-store";
import React from "react";

interface ServersLayoutProps {
  children: React.ReactNode;
}
function ChannelsLayout({ children }: ServersLayoutProps) {
  const { data, type } = useModal();
  return (
    <div className="w-full h-full  flex">
      <div className="bg-slate-20 w-ful flex flex-col flex-1 h-full ">
        {children}
      </div>
      {type !== "openThread" && (
        <ResizeComponent type="openThread">
          <ChatThreads />
        </ResizeComponent>
      )}
    </div>
  );
}

export default ChannelsLayout;
