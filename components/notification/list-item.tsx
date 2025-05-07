import { cn } from "@/lib/utils";
import React from "react";
import AvatarIcon from "../ui/avatar-icon";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { notificationType } from "@prisma/client";
import {
  MessageCircleIcon,
  MessageCircleReply,
  UsersRound,
} from "lucide-react";
const TIME_FORMAT = "MMM d, hh:mm a";

interface ListItemProps {
  title: string;
  imageUrl: string;
  className: string;
  children: React.ReactNode;
  id: string;
  type: "channels" | "conversations";
  receipentId: string;
  isRead: boolean;
  queryKey: string;
  memberId: string;
  profile: string;
  communicationType: "CHANNEL" | "DIRECT_MESSAGE";
  threadOwnerId: string;
  notificationType: "REPLY" | "MESSAGE" | "DIRECT_MESSAGE";
  createdAt: Date;
}
const notificationTypeIcon = {
  [notificationType.DIRECT_MESSAGE]: (
    <UsersRound className="w-4 h-4 text-zinc-700" />
  ),
  [notificationType.MESSAGE]: (
    <MessageCircleIcon className="w-4 h-4 text-zinc-700" />
  ),
  [notificationType.REPLY]: (
    <MessageCircleReply className="w-4 h-4 text-zinc-700" />
  ),
};
function ListItem({
  imageUrl,
  title,
  className,
  children,
  id,
  type,
  receipentId,
  isRead,
  queryKey,
  memberId,
  notificationType,
  profile,
  threadOwnerId,
  communicationType,
  createdAt,
}: ListItemProps) {
  const queryClient = useQueryClient();

  const params = useParams();

  const threadMessage =
    memberId === threadOwnerId
      ? (title as string)?.replace(`${profile}'s`, `your`)
      : title;

  const onCLick = async () => {
    if (!isRead) {
      await axios.patch(`/api/notifications/${receipentId}`);
      queryClient.refetchQueries({ queryKey: [queryKey] });
    }
  };

  const showTime = format(new Date(createdAt), TIME_FORMAT);

  return (
    <div onClick={onCLick} className="">
      <Link
        href={`/servers/${params?.serverId}/${
          communicationType === "CHANNEL" ? "channels" : "conversations"
        }/${id}`}
        className={cn(
          "flex flex-col gap-y-3 p-2 cursor-pointer hover:bg-zinc-100 transition",
          !isRead && "bg-zinc-200",
          className
        )}
      >
        <div className="flex justify-between items-center">
          <span className="flex gap-x-1 items-center">
            {notificationTypeIcon[notificationType]}
            <h1 className="text-[12px] text-zinc-500">
              {notificationType === "REPLY" && type === "channels"
                ? "replied in a channel "
                : notificationType === "REPLY" && type === "conversations"
                ? "replied in a direct-message"
                : ""}
              {notificationType !== "REPLY" && type === "channels"
                ? "commented in a channel"
                : notificationType !== "REPLY" && type === "conversations"
                ? "commented in a direct-message"
                : ""}
            </h1>
          </span>
          <span className="text-xs">{showTime}</span>
        </div>
        <div className="flex gap-x-3">
          <AvatarIcon
            imageUrl={imageUrl}
            width={35}
            height={35}
            className="!rounded-md !aspect-square"
          />
          <div className="flex flex-col gap-y-1">
            <div className="text-xs  line-clamp-2 text-zinc-800 leading-none font-semibold font-sans">
              {notificationType === "REPLY" ? threadMessage : title}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-neutral-500">
              {children}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ListItem;
