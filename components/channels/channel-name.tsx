import React from "react";
import ActionToolTip from "../ui/action-tooltip";
import {
  Channel,
  ChannelOnMember,
  ChannelType,
  ChannelVisibility,
  Member,
} from "@prisma/client";
import { Hash, Lock, Mic, Video } from "lucide-react";

interface ChannelNameProps {
  channel: Channel & { members: ChannelOnMember[] };
  currentMember: Member;
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
        <ActionToolTip
          side="right"
          align="center"
          label={channel.visibility}
          className=""
        >
          {channelIconType[channel.visibility]}
        </ActionToolTip>
        <div className="flex items-start justify-start gap-x-1 w-full ">
          <h1 className="px-1 flex items-center ">{channel.name}</h1>
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
  );
}

export default ChannelName;
