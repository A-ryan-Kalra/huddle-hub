"use client";

import {
  channel,
  channelOnMember,
  channelVisibility,
  member,
  memberRole,
  profile,
  server,
} from "@prisma/client";
import { ChevronDown, Hash, Lock, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ActionToolTip from "../ui/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "../ui/scroll-area";
import ChannelName from "../channels/channel-name";
import { Button } from "../ui/button";
import MemberName from "../members/member-name";

interface ChannelScetionProps {
  title: string;
  type: "channels" | "conversation";
  role: "ADMIN" | "MODERATOR" | "GUEST";
  allMembers: (member & { profile: profile })[];
  currentMember: member;
  channels?: (channel & { members: channelOnMember[] })[];
  members?: (member & { profile: profile })[];
  server?: server;
}

function CommunicationSection({
  title,
  channels,
  type,
  role,
  allMembers,
  currentMember,
  members,
  server,
}: ChannelScetionProps) {
  const { onOpen } = useModal();
  const [showHeight, setShowHeight] = useState(false);
  const admin = role === memberRole.ADMIN;
  const moderator = role === memberRole.MODERATOR || admin;

  return (
    <div className="mt-8 flex flex-col gap-y-1">
      <div className="flex items-center gap-x-1 group">
        <div
          onClick={() => setShowHeight((prev) => !prev)}
          className="p-1 cursor-pointer hover:bg-zinc-200 duration-300 transition w-fit rounded-md"
        >
          <ChevronDown
            className={`w-4 h-4 transition-all duration-300 ${
              showHeight && "-rotate-90"
            }`}
          />
        </div>

        <p className="p-1 cursor-pointer hover:bg-zinc-200 text-sm duration-300 transition w-fit rounded-md">
          {title}
        </p>
        {moderator && type === "channels" && (
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
        {type === "channels" ? (
          <ScrollArea
            className={`flex flex-col ${
              showHeight ? "max-h-0" : "max-h-[200px]"
            } transition-all duration-100`}
          >
            {channels?.map((channel, index) => (
              <ChannelName
                key={index}
                channel={channel}
                allMembers={allMembers}
                currentMember={currentMember}
                role={{ admin, moderator }}
              />
            ))}
          </ScrollArea>
        ) : (
          <ScrollArea
            className={`flex flex-col ${
              showHeight ? "max-h-0" : "max-h-[200px]"
            } transition-all duration-100`}
          >
            {members?.map((member, index) => (
              <MemberName
                key={index}
                member={member}
                // allMembers={allMembers}
                currentMember={currentMember}
              />
            ))}
          </ScrollArea>
        )}
      </>
      {type === "channels" && moderator && (
        <button
          onClick={() => onOpen("createChannel", { member: allMembers })}
          className="group p-1 text-sm gap-x-2 hover:bg-zinc-200 transition  flex items-center justify-start rounded-md"
        >
          <span className="group-hover:bg-slate-50 rounded-md p-1 transition">
            <PlusIcon className="w-3 h-3" />
          </span>
          <p className="px-1">Add Channels</p>
        </button>
      )}
      {type === "conversation" && (
        <button
          onClick={() => onOpen("invite", { server: server })}
          className="group p-1 text-sm gap-x-2 hover:bg-zinc-200 transition  flex items-center justify-start rounded-md"
        >
          <span className="group-hover:bg-slate-50 rounded-md p-1 transition">
            <PlusIcon className="w-3 h-3" />
          </span>
          <p className="px-1">Invite People</p>
        </button>
      )}
    </div>
  );
}

export default CommunicationSection;
