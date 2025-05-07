import { cn } from "@/lib/utils";
import React from "react";
import AvatarIcon from "../ui/avatar-icon";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface ListItemProps {
  title: string;
  imageUrl: string;
  className: string;
  children: React.ReactNode;
  id: string;
  type: string;
  receipentId: string;
  isRead: boolean;
  queryKey: string;
  memberId: string;
  profile: string;
  communicationType: "CHANNEL" | "DIRECT_MESSAGE";
  threadOwnerId: string;
  notificationType: "REPLY" | "MESSAGE" | "DIRECT_MESSAGE";
}

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

  return (
    <div onClick={onCLick} className="">
      <Link
        href={`/servers/${params?.serverId}/${
          communicationType === "CHANNEL" ? "channels" : "conversations"
        }/${id}`}
        className={cn(
          "flex  gap-x-3 p-2 cursor-pointer hover:bg-zinc-100 transition",
          !isRead && "bg-zinc-200",
          className
        )}
      >
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
      </Link>
    </div>
  );
}

export default ListItem;
