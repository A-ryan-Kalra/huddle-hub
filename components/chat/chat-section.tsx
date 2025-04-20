"use client";
import { Channel, ChannelOnMember, Profile } from "@prisma/client";
import { HashIcon, Loader2 } from "lucide-react";
import React, { Fragment } from "react";
import ChatWelcome from "./chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import UserComment from "../ui/user-comment";

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
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useChatQuery({ queryKey, paramKey, paramValue, apiUrl });
  console.log(data);

  return (
    <div className="flex flex-1 flex-col max-h-[80vh] bg-zinc-40 overflow-y-auto">
      {!hasNextPage && <div className=" flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} channel={channel} />}
      <div className="flex justify-center items-center">
        {isFetchingNextPage ? (
          <div className="my-1 animate-spin text-zinc-400">
            <Loader2 />
          </div>
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            className="text-sm text-zinc-500 my-1"
          >
            Load previous messages
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group?.items?.map((item, index) => (
              <UserComment message={item} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ChatSection;
