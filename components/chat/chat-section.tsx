"use client";
import { member, profile } from "@prisma/client";
import { HashIcon, Loader2, PenLine, ServerCrashIcon } from "lucide-react";
import React, { Fragment, useRef } from "react";
import ChatWelcome from "./chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import UserComment from "../ui/user-comment";

import useChatSocket from "@/hooks/use-chat-socket";
import useChatScroll from "@/hooks/use-chat-scroll";
import { cn } from "@/lib/utils";

interface ChatSectionProps {
  type: "channel" | "conversation" | "threads";

  paramKey: string;
  paramValue: string;
  apiUrl: string;
  chatId: string;
  name: string;
  createdAt?: string;
  chatName?: string;
  socketQuery: Record<string, any>;
  currentMember: member & { profile: profile };
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
  currentMember,
}: ChatSectionProps) {
  const chatRef = React.useRef<HTMLDivElement | null>(null);
  const threadRef = React.useRef<HTMLDivElement | null>(null);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useChatQuery({ queryKey, paramKey, paramValue, apiUrl });
  const audioRef = useRef(null);
  useChatScroll({
    chatRef,
    bottomRef,

    loadMore: fetchNextPage,
    shouldLoadMore: !!hasNextPage && !isFetchingNextPage,
    count: data?.pages[0]?.items?.length ?? 0,
  });

  useChatSocket({ audioRef, addKey, queryKey, updateKey });

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center gap-y-2 justify-center flex-1">
        <Loader2 className="animate-spin  text-zinc-500" />
        <h1 className="text-xs text-zinc-400">Loading Messages...</h1>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-y-2 justify-center flex-1">
        <ServerCrashIcon className="text-zinc-500" />
        <h1 className="text-xs text-zinc-400">Something went wrong</h1>
      </div>
    );
  }
  if (type === "threads" && data?.pages[0]?.items?.length === 0) {
    return (
      <div className="flex flex-col items-center gap-y-2 justify-center flex-1">
        <PenLine className="text-zinc-500" />
        <h1 className="text-xs text-zinc-400">Leave a reply</h1>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className={`flex ${
        type !== "threads"
          ? "flex-1 mt-auto h-full"
          : `mb-auto h-fit ${
              (threadRef?.current?.clientHeight ?? 0) >
                (chatRef?.current?.clientHeight ?? 0) && "flex-1"
            }`
      } flex-col  overflow-y-auto !scroll-smooth`}
    >
      {!hasNextPage && <div className=" flex-1" />}
      {type !== "threads" && !hasNextPage && (
        <ChatWelcome
          type={type}
          name={name}
          createdAt={createdAt as string}
          chatName={chatName as string}
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
        ref={threadRef}
        className={cn(
          "flex flex-col-reverse mt-auto my-2",
          hasNextPage && "flex-1"
        )}
      >
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group?.items?.map((item: any, index) => (
              <UserComment
                type={type}
                key={index}
                currentMember={currentMember}
                createdAt={item?.createdAt}
                message={item}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <audio className="bg-black p-2" ref={audioRef} src="/notification.mp3" />

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatSection;
