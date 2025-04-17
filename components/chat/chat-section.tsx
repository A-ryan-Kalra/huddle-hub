import { Channel, ChannelOnMember, Profile } from "@prisma/client";
import { HashIcon } from "lucide-react";
import React from "react";
import ChatWelcome from "./chat-welcome";

interface ChatSectionProps {
  type: "channel" | "conversation";
  channel: Channel & {
    members: ChannelOnMember[];
    profile: Profile;
  };
}
function ChatSection({ type, channel }: ChatSectionProps) {
  console.log(channel);
  return (
    <div className="flex flex-1 flex-col max-h-[80vh] bg-zinc-40 overflow-y-auto">
      <div className=" flex-1" />
      <ChatWelcome type={type} channel={channel} />
      <div className="mt-auto"></div>
    </div>
  );
}

export default ChatSection;
