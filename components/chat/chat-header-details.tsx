"use client";
import { Channel, ChannelOnMember, Member, Profile } from "@prisma/client";
import React from "react";
import { useSocket } from "../providers/socket-providers";
import ActionToolTip from "../ui/action-tooltip";
import { Badge } from "../ui/badge";

interface ChatHeaderDetailsProps {
  type: "channel" | "message";
  channel?: Channel & { members: ChannelOnMember[] };
  member?: Member & { profile: Profile };
}
function ChatHeaderDetails({ type, channel, member }: ChatHeaderDetailsProps) {
  const { isConnected } = useSocket();

  return (
    <>
      {type === "channel" && (
        <div className=" flex gap-x-1 items-center ">
          <h1 className="hover:bg-zinc-100 flex gap-x-1 transition cursor-pointer p-0.5 rounded-md">
            <span>{channel?.members?.length}</span>
            {channel && channel?.members?.length > 1 ? "Members" : "Member"}
          </h1>
          {isConnected ? (
            <ActionToolTip
              side="bottom"
              label="Real Time Connection"
              align="end"
            >
              <Badge
                variant={"outline"}
                className="!bg-emerald-600 rounded-full animate-pulse p-1.5 text-white font-semibold"
              ></Badge>
            </ActionToolTip>
          ) : (
            <ActionToolTip
              side="bottom"
              label="Fallback : Polling every 1s"
              align="end"
            >
              <Badge
                variant={"outline"}
                className="!bg-yellow-600 rounded-full animate-pulse p-1.5 text-white font-semibold"
              ></Badge>
            </ActionToolTip>
          )}
        </div>
      )}
    </>
  );
}

export default ChatHeaderDetails;
