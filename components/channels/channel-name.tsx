import React from "react";
import ActionToolTip from "../ui/action-tooltip";
import {
  Channel,
  ChannelOnMember,
  ChannelVisibility,
  Member,
} from "@prisma/client";
import { Hash, Lock } from "lucide-react";

interface ChannelNameProps {
  channel: Channel & { members: ChannelOnMember[] };
  currentMember: Member;
}

const channelIconType = {
  [ChannelVisibility.PUBLIC]: <Hash className="w-4 h-4" />,
  [ChannelVisibility.PRIVATE]: <Lock className="w-4 h-4" />,
};

function ChannelName({ channel, currentMember }: ChannelNameProps) {
  const ownerOfPrivateChannel = channel.profileId === currentMember.profileId;

  console.log(ownerOfPrivateChannel);
  const onClick = (channel: Channel & { members: ChannelOnMember[] }) => {
    console.log(channel);
    console.log(currentMember.id);
    if (
      channel.visibility === "PRIVATE" &&
      !ownerOfPrivateChannel &&
      !channel.members.some((member) => member.memberId === currentMember?.id)
    ) {
      return null;
    }

    console.log(currentMember);
  };
  return (
    <div
      onClick={() => onClick(channel)}
      className="p-1 cursor-pointer hover:bg-zinc-200 duration-300 transition text-sm rounded-md w-full"
    >
      <div className="flex gap-x-2 items-center">
        <ActionToolTip side="left" label={channel.visibility} className="">
          {channelIconType[channel.visibility]}
        </ActionToolTip>
        <h1 className="px-1">{channel.name}</h1>
      </div>
    </div>
  );
}

export default ChannelName;
