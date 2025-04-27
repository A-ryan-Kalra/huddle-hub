import { Channel, ChannelOnMember, Member, Profile } from "@prisma/client";
import { Menu } from "lucide-react";
import React from "react";

import { MobileToggle } from "../mobile-toggle";
import ChatHeaderName from "./chat-header-name";
import ChatHeaderDetails from "./chat-header-details";

interface ChatHeaderProps {
  type: "channel" | "message";
  channel?: Channel & { members: ChannelOnMember[] };
  member?: Member & { profile: Profile };
}
function ChatHeader({ channel, type, member }: ChatHeaderProps) {
  return (
    <div className=" border-b-[1px] border-b-zinc-400 w-full">
      <div className="flex justify-between items-center w-full px-2 py-2">
        <div className="flex w-full items-center">
          <div className="p-1 md:hidden">
            <MobileToggle serverId={channel?.serverId as string}>
              <Menu className="w-4 h-4" />
            </MobileToggle>
          </div>
          <ChatHeaderName channel={channel} member={member} type={type} />
        </div>

        <ChatHeaderDetails channel={channel} member={member} type={type} />
      </div>
    </div>
  );
}

export default ChatHeader;
