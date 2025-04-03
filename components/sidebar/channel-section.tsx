"use client";

import { Channel, ChannelOnMember, MemberRole } from "@prisma/client";
import { ChevronDown, PlusIcon } from "lucide-react";
import React from "react";
import ActionToolTip from "../ui/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ChannelScetionProps {
  title: string;
  type: "channels" | "messages";
  channels?: ChannelOnMember[];
  role: "ADMIN" | "MODERATOR" | "GUEST";
}
function ChannelSection({ title, channels, type, role }: ChannelScetionProps) {
  const { onOpen } = useModal();
  return (
    <div className="mt-8">
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
              onClick={() => onOpen("createChannel")}
              className="p-1 group-hover:visible invisible cursor-pointer hover:bg-zinc-200 duration-300 transition w-fit rounded-md"
            >
              <PlusIcon className="w-4 h-4" />
            </div>
          </ActionToolTip>
        )}
      </div>
    </div>
  );
}

export default ChannelSection;
