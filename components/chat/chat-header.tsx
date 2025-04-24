"use client";
import { Channel, ChannelOnMember, Member, Profile } from "@prisma/client";
import { Hash } from "lucide-react";
import React from "react";
import AvatarIcon from "../ui/avatar-icon";
import { useSocket } from "../providers/socket-providers";
import { Badge } from "../ui/badge";
import ActionToolTip from "../ui/action-tooltip";

interface ChatHeaderProps {
  type: "channel" | "message";
  channel?: Channel & { members: ChannelOnMember[] };
  member?: Member & { profile: Profile };
}
function ChatHeader({ channel, type, member }: ChatHeaderProps) {
  const { isConnected } = useSocket();
  return (
    <div className=" border-b-[1px] border-b-zinc-400 w-full">
      <div className="flex justify-between items-center  px-2 py-2">
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
              <ActionToolTip
                side="left"
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

        {type === "channel" && (
          <div className="flex gap-x-1 items-center ">
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
      </div>
    </div>
  );
}

export default ChatHeader;
