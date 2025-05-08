"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Bell, BotMessageSquare, Loader2 } from "lucide-react";

import useChatQuery from "@/hooks/use-chat-query";

import ListItem from "../notification/list-item";
import useNotificationSocket from "@/hooks/use-notification-socket";
import useChatSocket from "@/hooks/use-chat-socket";

interface NotificationProps {
  currentMemberId: string;
}

export function Notification({ currentMemberId }: NotificationProps) {
  // const triggerKey = `chat:${triggerChatId}`;
  const notificationQuery = currentMemberId;
  const queryKey = `notification:${notificationQuery}`;
  const addKey = `notification:${notificationQuery}:newAlert`;
  const chatRef = React.useRef<HTMLDivElement | null>(null);
  const audioRef = React.useRef(null);

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    refetch,
  } = useChatQuery({
    queryKey,
    apiUrl: `/api/notifications`,
    type: "notification",
  });
  const [notReadTotal, setNotReadTotal] = React.useState<number>(0);

  useNotificationSocket({
    addKey,
    queryKey,
    audioRef,
  });

  React.useEffect(() => {
    const topDiv = chatRef?.current;
    setNotReadTotal(data?.pages[0]?.notReadTotal as number);

    const handleScroll = () => {
      const distanceFromBottom = !topDiv
        ? false
        : topDiv?.scrollHeight - (topDiv?.clientHeight + topDiv?.scrollTop) <=
          15;

      if (distanceFromBottom && !!hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };
    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [
    chatRef,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    data?.pages[0]?.notReadTotal,
  ]);
  // console.log(data);

  return (
    <div className="relative group">
      <audio className="" ref={audioRef} src="/notification.mp3" />

      <button className="hover:bg-zinc-200 transition relative rounded-md p-1">
        <Bell className="w-6 h-6" />
        {notReadTotal > 0 && (
          <span className="absolute top-0 right-1 flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
          </span>
        )}
      </button>
      <div
        className={cn(
          "absolute top-3 rounded-xl overflow-hidden left-3 z-10 bg-white gap-y-2 flex flex-col",
          `group-hover:visible group-hover:scale-100  transition-all ease-out group-hover:opacity-100 opacity-0 border-[1px] scale-95 invisible delay-200`
        )}
      >
        <h1 className="p-2 border-b-[1px] flex items-center justify-between font-semibold tracking-wide">
          Notifications
          {notReadTotal > 0 && (
            <span className="text-xs flex items-end font-medium gap-x-0.5 text-zinc-800">
              <span className="font-semibold">{notReadTotal}</span>unread
              {notReadTotal <= 1 ? " message" : " messages"}
            </span>
          )}
        </h1>
        <div
          ref={chatRef}
          className={cn(
            "flex  flex-1 max-sm:max-h-[330px] max-h-[400px] !scroll-smooth overflow-y-auto flex-col gap-y-1"
          )}
        >
          {!data?.pages[0]?.items?.length ? (
            <div className="flex flex-col items-center gap-y-2 justify-center flex-1  w-[300px] min-h-[300px]">
              <BotMessageSquare className="text-zinc-500" />
              <h1 className="text-xs text-zinc-600">
                Nothing to see here - check back later!
              </h1>
            </div>
          ) : (
            <ul className="flex flex-1 flex-col gap-y-1 w-[300px]">
              {data?.pages?.map((component, index) => (
                <React.Fragment key={index}>
                  {component?.items?.map((member, index) => (
                    <ListItem
                      profile={member?.member?.profile?.name}
                      threadOwnerId={
                        member?.notification?.threadMessageOwnerId ?? ""
                      }
                      memberId={member?.member?.id}
                      notificationType={member?.notification?.type}
                      key={index}
                      isRead={member?.isRead}
                      refetch={refetch}
                      receipentId={member?.id}
                      createdAt={member?.notification?.createdAt}
                      communicationType={
                        member?.notification?.communicationType
                      }
                      className="border-b-[1px] flex gap-x-1"
                      type={
                        member?.notification?.type === "MESSAGE"
                          ? "channels"
                          : "conversations"
                      }
                      title={member?.notification?.message}
                      id={member?.notification?.channel_direct_messageId}
                      imageUrl={
                        member?.notification?.notificationSent?.profile
                          ?.imageUrl
                      }
                    >
                      {cleanContent(member?.notification?.content)}
                    </ListItem>
                  ))}
                </React.Fragment>
              ))}

              {hasNextPage && (
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
                      Load more
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const cleanContent = (content: string) => {
  const div = document.createElement("div");
  div.innerHTML = content;
  return div.textContent || div.innerText || "";
};
