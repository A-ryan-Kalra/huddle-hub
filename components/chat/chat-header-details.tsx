"use client";
import {
  channel,
  channelOnMember,
  member,
  profile,
  server,
} from "@prisma/client";
import React from "react";
import { useSocket } from "../providers/socket-providers";
import ActionToolTip from "../ui/action-tooltip";
import { Badge } from "../ui/badge";
import { useModal } from "@/hooks/use-modal-store";
import ChatVideoButton from "../chat-video-button";

interface ChatHeaderDetailsProps {
  type: "channel" | "message";
  channel?: channel & {
    members: (channelOnMember & { member: member & { profile: profile } })[];
    server: server;
  };
  member?: member & { profile: profile };
}
function ChatHeaderDetails({ type, channel, member }: ChatHeaderDetailsProps) {
  const { isConnected } = useSocket();
  const { onOpen } = useModal();

  return (
    <>
      <div className=" flex gap-x-1 items-center">
        {type === "channel" && (
          <h1
            onClick={() =>
              onOpen("showChannelMembers", {
                member: channel?.members?.map((member) => member?.member),
                server: channel?.server,
                channelId: channel?.members[0].channelId,
                currentMember: member,
                name: channel?.name,
              })
            }
            className="hover:bg-zinc-100 flex gap-x-1 transition cursor-pointer p-0.5 rounded-md"
          >
            <span>{channel?.members?.length}</span>
            {channel && channel?.members?.length > 1 ? "Members" : "Member"}
          </h1>
        )}
        {type === "message" && <ChatVideoButton />}
        <>
          {isConnected ? (
            <ActionToolTip
              side="bottom"
              label="Real Time Connection"
              className="flex items-center"
              align="end"
            >
              <Badge
                variant={"outline"}
                className="!bg-emerald-600 rounded-full p-1.5 text-white font-semibold"
              ></Badge>
            </ActionToolTip>
          ) : (
            <ActionToolTip
              className="flex items-center"
              side="bottom"
              label="Fallback : Polling every 1s"
              align="end"
            >
              <Badge
                variant={"outline"}
                className="!bg-yellow-600 rounded-full p-1.5 text-white font-semibold"
              ></Badge>
            </ActionToolTip>
          )}
        </>
      </div>
    </>
  );
}

export default ChatHeaderDetails;
