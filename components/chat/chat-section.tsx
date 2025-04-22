"use client";
import { Channel, ChannelOnMember, Profile } from "@prisma/client";
import { HashIcon, Loader2 } from "lucide-react";
import React, { Fragment } from "react";
import ChatWelcome from "./chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import UserComment from "../ui/user-comment";
import { format } from "date-fns";
import useChatSocket from "@/hooks/use-chat-socket";
import useChatScroll from "@/hooks/use-chat-scroll";
import { cn } from "@/lib/utils";

interface ChatSectionProps {
  type: "channel" | "conversation";

  paramKey: string;
  paramValue: string;
  apiUrl: string;
  chatId: string;
  name: string;
  createdAt: string;
  chatName: string;
  socketQuery: Record<string, any>;
}

const DATE_FORMAT = "d/MM/yyyy, hh:mm a";
function ChatSection({
  type,
  paramKey,
  paramValue,
  apiUrl,
  chatId,
  createdAt,
  name,
  chatName,
  socketQuery,
}: ChatSectionProps) {
  const chatRef = React.useRef<HTMLDivElement | null>(null);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useChatQuery({ queryKey, paramKey, paramValue, apiUrl });

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !!hasNextPage && !isFetchingNextPage,
    count: data?.pages[0]?.items?.length ?? 0,
  });

  const chat = useChatSocket({ addKey, queryKey });
  console.log(data);

  return (
    <div
      ref={chatRef}
      className="flex flex-1 mt-auto flex-col h-full overflow-y-auto !scroll-smooth"
    >
      {!hasNextPage && <div className=" flex-1" />}
      {!hasNextPage && (
        <ChatWelcome
          type={type}
          name={name}
          createdAt={createdAt}
          chatName={chatName}
        />
      )}
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
      <div
        className={cn(
          "flex flex-col-reverse mt-auto my-2",
          hasNextPage && "flex-1"
        )}
      >
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group?.items?.map((item, index) => (
              <UserComment
                createdAt={format(new Date(item?.createdAt), DATE_FORMAT)}
                message={item}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatSection;
