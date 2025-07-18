"use client";
import ChatThreads from "@/components/chat/chat-threads";
import ResizeComponent from "@/components/ui/resize-component";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import React from "react";

interface ServersLayoutProps {
  children: React.ReactNode;
}
function ChannelsLayout({ children }: ServersLayoutProps) {
  const { type } = useModal();
  const params = useParams();

  return (
    <div className="w-full h-full  flex">
      <div
        className={cn(
          `w-ful max-lg:hidden flex-col flex-1 h-full ${
            type !== "openThread" && "flex"
          }`
        )}
      >
        {children}
      </div>
      {type === "openThread" && (
        <ResizeComponent type="openThread">
          <ChatThreads params={params} />
        </ResizeComponent>
      )}
    </div>
  );
}

export default ChannelsLayout;
