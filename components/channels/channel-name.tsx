"use client";
import React, { useState } from "react";
import ActionToolTip from "../ui/action-tooltip";
import {
  channel,
  channelOnMember,
  channelType,
  channelVisibility,
  member,
  memberRole,
  profile,
} from "@prisma/client";
import { Hash, Lock, Mic, UserIcon, Video } from "lucide-react";
import { toast } from "sonner";
import CustomizeChannelComp from "./customize-channels-comp";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import useNotificationAlert from "@/hooks/use-notification-alert";
import { cn } from "@/lib/utils";

interface ChannelNameProps {
  channel: channel & { members: channelOnMember[] };
  currentMember: member;
  allMembers: (member & { profile: profile })[];
  role: { admin: boolean; moderator: boolean };
  type?: "channel" | "messages";
}

const channelIconVisibilityType = {
  [channelVisibility.PUBLIC]: <Hash className="w-4 h-4" />,
  [channelVisibility.PRIVATE]: <Lock className="w-4 h-4" />,
};

const channelTypeIcon = {
  [channelType.AUDIO]: <Mic className="w-4 h-4" />,
  [channelType.VIDEO]: <Video className="w-4 h-4" />,
  [channelType.TEXT]: null,
};

function ChannelName({
  channel,
  currentMember,
  allMembers,
  role,
}: ChannelNameProps) {
  const { onClose } = useModal();
  const params = useParams();
  const [totalNotification, setTotalNotifications] = useState(0);

  useNotificationAlert({
    notificationId: channel.id === params?.channelId ? "" : channel.id,

    countNotification: () => setTotalNotifications((prev) => prev + 1),
  });

  const ownerOfChannel = channel.profileId === currentMember.profileId;
  const accessToPrivateChannel = channel.members.some(
    (member) => member.memberId === currentMember?.id
  );
  const router = useRouter();

  const onClick = (channel: channel & { members: channelOnMember[] }) => {
    setTotalNotifications(0);
    if (!accessToPrivateChannel && channel.visibility === "PRIVATE") {
      toast("Unauthorized Access", {
        description: "Oops! This channel is private",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });

      return null;
    } else if (channel.visibility === "PUBLIC" && !accessToPrivateChannel) {
      toast("Unauthorized Access", {
        description: "Oops! You are not a member of this channel anymore.",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
      return null;
    }

    router.push(`/servers/${channel.serverId}/channels/${channel.id}`);
    onClose();
  };

  return (
    <CustomizeChannelComp
      role={role}
      ownerOfChannel={ownerOfChannel}
      allMembers={allMembers}
      channel={channel}
    >
      <div
        onClick={() => onClick(channel)}
        className={cn(
          "p-1  cursor-pointer hover:bg-zinc-200 duration-300 transition text-sm rounded-md w-full",
          params?.channelId === channel?.id && "bg-zinc-300 hover:bg-zinc-300"
        )}
      >
        {totalNotification > 0 && (
          <div className="flex  items-center gap-x-1 size-3  absolute top-2 right-3">
            <span className=" flex size-3 ">
              <span className="absolute animate-ping inline-flex h-full w-full  rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
            </span>
            <h1>{totalNotification}</h1>
          </div>
        )}
        <div className="flex gap-x-2 items-center">
          <ActionToolTip
            side="top"
            align="end"
            label={channel.visibility}
            className=""
          >
            {channelIconVisibilityType[channel.visibility]}
          </ActionToolTip>
          <div className="flex items-start justify-start gap-x-1 w-full ">
            <h1 className="px-1 flex items-center ">
              {channel.name}
              {!role.admin && ownerOfChannel && (
                <ActionToolTip
                  className=" self-end"
                  label={"Owner"}
                  side="right"
                >
                  <UserIcon className="text-red-500 w-4 h-4 mx-2" />
                </ActionToolTip>
              )}
            </h1>
            <ActionToolTip
              className=" self-end"
              label={channel.type}
              side="top"
              align="center"
            >
              {channelTypeIcon[channel.type]}
            </ActionToolTip>
          </div>
        </div>
      </div>
    </CustomizeChannelComp>
  );
}

export default ChannelName;
