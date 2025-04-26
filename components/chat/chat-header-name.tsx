"use client";
import React from "react";
import AvatarIcon from "../ui/avatar-icon";
import { Hash } from "lucide-react";
import { Channel, ChannelOnMember, Member, Profile } from "@prisma/client";
import { useSocket } from "../providers/socket-providers";
import ActionToolTip from "../ui/action-tooltip";
import { Badge } from "../ui/badge";

interface ChatHeaderNameProps {
  type: "channel" | "message";
  channel?: Channel & { members: ChannelOnMember[] };
  member?: Member & { profile: Profile };
}
function ChatHeaderName({ type, channel, member }: ChatHeaderNameProps) {
  const { isConnected } = useSocket();
  return (
    <>
      {type === "channel" ? (
        <h1 className="flex hover:bg-zinc-100 cursor-pointer rounded-md items-center gap-x-1 font-semibold">
          <Hash className="w-5 h-5" />
          <span>{channel?.name}</span>
        </h1>
      ) : (
        <div className="w-full flex items-center justify-between">
          <div className="gap-x-1 flex items-center hover:bg-zinc-100  cursor-pointer rounded-md">
            <AvatarIcon
              width={20}
              height={20}
              imageUrl={member?.profile.imageUrl as string}
            />
            <h1 className="flex items-center gap-x-1 font-semibold">
              {member?.profile.name}
            </h1>
          </div>
          {isConnected ? (
            <ActionToolTip side="left" label="Real Time Connection" align="end">
              <Badge
                variant={"outline"}
                className="!bg-emerald-600 rounded-full animate-pulse p-1.5 text-white font-semibold"
              ></Badge>
            </ActionToolTip>
          ) : (
            <ActionToolTip
              side="left"
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

export default ChatHeaderName;
