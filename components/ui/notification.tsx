"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Bell, Loader2 } from "lucide-react";

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
  const [countNotification, setCountNotification] = React.useState(0);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl: `/api/notifications`,
      type: "notification",
    });

  useNotificationSocket({
    addKey,
    queryKey,
  });
  console.log(countNotification);
  React.useEffect(() => {
    const topDiv = chatRef?.current;

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
  }, [chatRef, isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <div className="relative group">
      <button className="hover:bg-zinc-200 transition rounded-md p-1">
        <Bell className="w-6 h-6" />
      </button>
      <div
        className={cn(
          "absolute top-3 rounded-xl overflow-hidden left-3 z-10 bg-white gap-y-2 flex flex-col",
          `group-hover:visible group-hover:scale-100 transition-all ease-out group-hover:opacity-100 opacity-0 border-[1px] scale-95 invisible delay-200`
        )}
      >
        <h1 className="p-2 border-b-[1px] font-semibold tracking-wide">
          Notifications
        </h1>
        <div
          ref={chatRef}
          className="flex  flex-1 max-h-[400px] !scroll-smooth overflow-y-auto flex-col gap-y-1"
        >
          <ul className="flex flex-1 flex-col gap-y-1 w-[300px]">
            {data?.pages?.map((component, index) => (
              <React.Fragment key={index}>
                {component?.items?.map((member, index) => (
                  <ListItem
                    key={index}
                    className="border-b-[1px] flex gap-x-1"
                    // href={component.href}
                    title={member?.notification?.message}
                    imageUrl={
                      member?.notification?.notificaionSent?.profile?.imageUrl
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
