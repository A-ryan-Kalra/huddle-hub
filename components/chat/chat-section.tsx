"use client";
import { member, profile } from "@prisma/client";
import { HashIcon, Loader2, PenLine, ServerCrashIcon } from "lucide-react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import ChatWelcome from "./chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import UserComment from "../ui/user-comment";

import useChatSocket from "@/hooks/use-chat-socket";
import useChatScroll from "@/hooks/use-chat-scroll";
import { cn } from "@/lib/utils";
import queryString from "query-string";
import { Button } from "../ui/button";

interface ChatSectionProps {
  type: "channel" | "conversation" | "threads";
  isInvitedComplete?: boolean;
  triggerChatId?: string;
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
  triggerChatId,
  isInvitedComplete,
}: ChatSectionProps) {
  const chatRef = React.useRef<HTMLDivElement | null>(null);
  const threadRef = React.useRef<HTMLDivElement | null>(null);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);
  const queryKey = `chat:${chatId}`;
  const triggerKey = `chat:${triggerChatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const audioRef = useRef(null);
  const hasRunRef = useRef<boolean>(false);
  const [selectMessage, setSelectMessage] = useState<HTMLDivElement | null>(
    null
  );

  const allMessageRef = useRef<Record<string, HTMLDivElement | null>>({});

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useChatQuery({ queryKey, paramKey, paramValue, apiUrl });

  useEffect(() => {
    if (hasRunRef.current || !isInvitedComplete) {
      return;
    }
    hasRunRef.current = true;

    (async () => {
      const url = queryString.stringifyUrl({
        url: `/api/socket/invite`,
        query: {
          memberId: currentMember?.id,
          serverId: currentMember?.serverId,
        },
      });
      const res = await fetch(url);
      await res.json();
    })();
  }, []);

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !!hasNextPage && !isFetchingNextPage,
    count: data?.pages[0]?.items?.length ?? 0,
  });

  useChatSocket({
    audioRef,
    addKey,
    queryKey,
    updateKey,
    type,
    triggerKey,
  });

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
  let timeoutId: number | null | any = null;

  const delay = (ms: number) => {
    return new Promise<void>((resolve) => {
      timeoutId = setTimeout(resolve, ms);
    });
  };
  const navigateToDOM = async (messageId: string) => {
    // await delay(500);
    if (selectMessage) {
      (selectMessage as HTMLDivElement).style.borderRadius = "";
      (selectMessage as HTMLDivElement).style.border = "";
    }

    if (!allMessageRef.current[messageId]) {
      return false;
    }
    await delay(500);
    const message = allMessageRef.current[messageId];
    const child = message?.children?.[0] as HTMLDivElement;

    if (child && child?.style) {
      (child.children[1] as HTMLDivElement).style.borderRadius =
        "10px 10px 10px 3px";
      (child.children[1] as HTMLDivElement).style.border = "2px solid #479fa2";
      setSelectMessage(child.children[1] as HTMLDivElement);
    }
    allMessageRef.current[messageId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    return allMessageRef.current[messageId] ? true : false;
  };
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
                replyRef={(reply: Record<string, HTMLDivElement>) =>
                  (allMessageRef.current = {
                    ...allMessageRef?.current,
                    ...reply,
                  })
                }
                allReplyRef={navigateToDOM}
                type={type}
                key={index}
                currentMember={currentMember}
                createdAt={item?.createdAt}
                message={item}
                socketQuery={socketQuery}
                fetchNextPage={fetchNextPage}
                count={data?.pages[0]?.items?.length ?? 0}
              />
            ))}
          </Fragment>
        ))}
      </div>

      <audio className="" ref={audioRef} src="/notification.mp3" />

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatSection;
