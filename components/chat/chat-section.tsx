"use client";
import { Channel, ChannelOnMember, Profile } from "@prisma/client";
import { HashIcon } from "lucide-react";
import React from "react";
import ChatWelcome from "./chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";

interface ChatSectionProps {
  type: "channel" | "conversation";
  channel: Channel & {
    members: ChannelOnMember[];
    profile: Profile;
  };
  paramKey: string;
  paramValue: string;
  apiUrl: string;
}
function ChatSection({
  type,
  channel,
  paramKey,
  paramValue,
  apiUrl,
}: ChatSectionProps) {
  const queryKey = `chat:${channel.id}`;
  // const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
  //   useChatQuery({ queryKey, paramKey, paramValue, apiUrl });

  // console.log(data, fetchNextPage, isFetchingNextPage, hasNextPage, status);
  return (
    <div className="flex flex-1 flex-col max-h-[80vh] bg-zinc-40 overflow-y-auto">
      <div className=" flex-1" />
      <ChatWelcome type={type} channel={channel} />
      <div className="mt-auto"></div>
    </div>
  );
}

export default ChatSection;
