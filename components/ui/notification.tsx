"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Bell, Loader2 } from "lucide-react";
import useChatSocket from "@/hooks/use-chat-socket";
import useChatQuery from "@/hooks/use-chat-query";
import AvatarIcon from "./avatar-icon";
import useChatScroll from "@/hooks/use-chat-scroll";

interface NotificationProps {
  currentMemberId: string;
}

export function Notification({ currentMemberId }: NotificationProps) {
  // const triggerKey = `chat:${triggerChatId}`;
  const notificationQuery = currentMemberId;
  const queryKey = `notification:${notificationQuery}`;
  const addKey = `notification:${notificationQuery}:newAlert`;
  const chatRef = React.useRef<HTMLDivElement | null>(null);
  const [newChatRef, setNewChatRef] =
    React.useState<React.RefObject<any> | null>();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl: `/api/notifications`,
      type: "notification",
    });

  // const updateKey = `chat:${chatId}:messages:update`;
  // const audioRef = useRef(null);
  console.log(data?.pages);

  useChatSocket({ addKey, queryKey });
  const handleMouseEnter = () => {
    console.log(chatRef.current);

    setNewChatRef(chatRef as React.RefObject<HTMLDivElement>);

    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.focus();
      }
    }, 0);
  };

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

  console.log(chatRef);
  // console.log(newChatRef?.current?.scrollTop);
  return (
    <NavigationMenu className="">
      <NavigationMenuList className="!h-fit !m-0 !p-0">
        <NavigationMenuItem>
          <NavigationMenuTrigger
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseEnter}
            className="hover:bg-zinc-200 transition rounded-md p-1"
          >
            <Bell className="w-6 h-6" />
          </NavigationMenuTrigger>
          <div className=" !p-0  ">
            <h1 className="p-2 border-b-[1px] font-semibold tracking-wide">
              Notifications
            </h1>
            <div
              ref={chatRef}
              className="flex flex-1 mt-auto max-h-[400px] overflow-y-auto flex-col gap-y-1"
            >
              <ul className="flex flex-1 flex-col gap-y-1 w-[300px]">
                {data?.pages?.map((component, index) => (
                  <React.Fragment key={index}>
                    {component?.items?.map((member, index) => (
                      <ListItem
                        key={index}
                        title={member?.notification?.message}
                        className="border-b-[1px] flex gap-x-1"
                        // href={component.href}
                        imageUrl={
                          member?.notification?.notificaionSent?.profile
                            ?.imageUrl
                        }
                      >
                        {cleanContent(member?.notification?.content)}
                      </ListItem>
                    ))}
                  </React.Fragment>
                ))}

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
                {!hasNextPage && <div className=" flex-1 bg-black" />}
              </ul>
            </div>
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { imageUrl: string }
>(({ className, title, children, imageUrl, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-xs  line-clamp-2 text-black leading-none">
            {title}
          </div>
          <div className="flex gap-x-1">
            <AvatarIcon
              imageUrl={imageUrl}
              width={30}
              height={30}
              className="!aspect-square"
            />
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
const cleanContent = (content: string) => {
  const div = document.createElement("div");
  div.innerHTML = content;
  return div.textContent || div.innerText || "";
};
