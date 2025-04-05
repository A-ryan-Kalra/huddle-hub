"use client";

import {
  Channel,
  ChannelOnMember,
  ChannelVisibility,
  Member,
  MemberRole,
  Profile,
} from "@prisma/client";
import { ChevronDown, Hash, Lock, PlusIcon } from "lucide-react";
import React from "react";
import ActionToolTip from "../ui/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "../ui/scroll-area";
import ChannelName from "../channels/channel-name";

interface ChannelScetionProps {
  title: string;
  type: "channels" | "messages";
  channels: (Channel & { members: ChannelOnMember[] })[];
  role: "ADMIN" | "MODERATOR" | "GUEST";
  allMembers: (Member & { profile: Profile })[];
  currentMember: Member;
}

function CommunicationSection({
  title,
  channels,
  type,
  role,
  allMembers,
  currentMember,
}: ChannelScetionProps) {
  const { onOpen } = useModal();

  return (
    <div className="mt-8 flex flex-col gap-y-1">
      <div className="flex items-center gap-x-1 group">
        <div className="p-1 cursor-pointer hover:bg-zinc-200 duration-300 transition w-fit rounded-md">
          <ChevronDown className="w-4 h-4" />
        </div>

        <p className="p-1 cursor-pointer hover:bg-zinc-200 text-sm duration-300 transition w-fit rounded-md">
          {title}
        </p>
        {(role === MemberRole.ADMIN || role === MemberRole.MODERATOR) && (
          <ActionToolTip
            className="ml-auto flex items-center"
            label="Add a new channel"
          >
            <div
              onClick={() => onOpen("createChannel", { member: allMembers })}
              className="p-1 group-hover:visible invisible cursor-pointer hover:bg-zinc-200 duration-300 transition w-fit rounded-md"
            >
              <PlusIcon className="w-4 h-4" />
            </div>
          </ActionToolTip>
        )}
      </div>
      <>
        {type === "channels" && (
          <ScrollArea className="flex flex-col max-h-[200px]">
            {channels?.map((channel, index) => (
              <ChannelName
                key={index}
                channel={channel}
                currentMember={currentMember}
              />
            ))}
          </ScrollArea>
        )}
      </>
    </div>
  );
}

export default CommunicationSection;
