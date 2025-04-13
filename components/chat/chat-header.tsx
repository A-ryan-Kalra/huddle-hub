import { Channel, ChannelOnMember, Member } from "@prisma/client";
import { Hash } from "lucide-react";
import React from "react";

interface ChatHeaderProps {
  type: "channel" | "message";
  channel?: Channel & { members: ChannelOnMember[] };
}
function ChatHeader({ channel, type }: ChatHeaderProps) {
  return (
    <div className=" border-b-[1px] border-b-zinc-400  w-full">
      <div className="flex justify-between items-center px-2 py-2">
        {type === "channel" && (
          <h1 className="flex items-center gap-x-1 font-semibold">
            <Hash className="w-5 h-5" />
            <span>{channel?.name}</span>
          </h1>
        )}

        {type === "channel" && (
          <div className="flex gap-x-1 hover:bg-zinc-100 transition cursor-pointer p-1 rounded-md">
            {channel?.members?.length}
            <span>
              {channel && channel?.members?.length > 1 ? "Members" : "Member"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
