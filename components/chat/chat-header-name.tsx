"use client";
import React from "react";
import AvatarIcon from "../ui/avatar-icon";
import { Hash } from "lucide-react";
import {
  channel,
  channelOnMember,
  member,
  profile,
  server,
} from "@prisma/client";
import { useSocket } from "../providers/socket-providers";
import ActionToolTip from "../ui/action-tooltip";
import { Badge } from "../ui/badge";
import useReload from "@/hooks/use-reload";
import { useRouter } from "next/navigation";

interface ChatHeaderNameProps {
  type: "channel" | "message";
  channel?: channel & {
    members: (channelOnMember & { member: member & { profile: profile } })[];
  };
  member?: member & { profile: profile };
}
function ChatHeaderName({ type, channel, member }: ChatHeaderNameProps) {
  const { isConnected } = useSocket();
  const router = useRouter();
  useReload({ memberId: member?.id as string, reloadPage: router.refresh });

  return (
    <>
      {type === "channel" ? (
        <h1 className="flex hover:bg-zinc-100 cursor-pointer rounded-md items-center gap-x-1 font-semibold">
          <Hash className="w-5 h-5" />
          <span>{channel?.name}</span>
        </h1>
      ) : (
        <div className="w-full flex items-center justify-between">
          <div className="gap-x-1 flex items-center hover:bg-zinc-100  cursor-pointer rounded-md">
            <AvatarIcon
              width={20}
              height={20}
              imageUrl={member?.profile.imageUrl as string}
            />
            <h1 className="flex items-center gap-x-1 font-semibold">
              {member?.profile.name}
            </h1>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatHeaderName;
