"use client";
import React from "react";
import ActionToolTip from "../ui/action-tooltip";
import {
  Channel,
  ChannelOnMember,
  ChannelType,
  ChannelVisibility,
  Member,
  MemberRole,
  Profile,
} from "@prisma/client";
import { Hash, Lock, Mic, UserIcon, Video } from "lucide-react";
import { toast } from "sonner";
import CustomizeChannelComp from "./customize-channels-comp";
import { useRouter } from "next/navigation";

interface ChannelNameProps {
  channel: Channel & { members: ChannelOnMember[] };
  currentMember: Member;
  allMembers: (Member & { profile: Profile })[];
  role: { admin: boolean; moderator: boolean };
  type?: "channel" | "messages";
}

const channelIconType = {
  [ChannelVisibility.PUBLIC]: <Hash className="w-4 h-4" />,
  [ChannelVisibility.PRIVATE]: <Lock className="w-4 h-4" />,
};

const channelType = {
  [ChannelType.AUDIO]: <Mic className="w-4 h-4" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4" />,
  [ChannelType.TEXT]: null,
};

function ChannelName({
  channel,
  currentMember,
  allMembers,
  role,
}: ChannelNameProps) {
  const ownerOfChannel = channel.profileId === currentMember.profileId;
  const accessToPrivateChannel =
    channel.visibility === "PRIVATE" &&
    channel.members.some((member) => member.memberId === currentMember?.id);
  const router = useRouter();

  const onClick = (channel: Channel & { members: ChannelOnMember[] }) => {
    if (!accessToPrivateChannel && channel.visibility === "PRIVATE") {
      console.log("private");

      toast("Unauthorized Access", {
        description: "Oops! This channel is private",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
      return null;
    }
    console.log("public");
    router.push(`/servers/${channel.serverId}/channels/${channel.id}`);
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
        className="p-1  cursor-pointer hover:bg-zinc-200 duration-300 transition text-sm rounded-md w-full"
      >
        <div className="flex gap-x-2 items-center">
          <ActionToolTip
            side="top"
            align="end"
            label={channel.visibility}
            className=""
          >
            {channelIconType[channel.visibility]}
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
              side="right"
            >
              {channelType[channel.type]}
            </ActionToolTip>
          </div>
        </div>
      </div>
    </CustomizeChannelComp>
  );
}

export default ChannelName;
