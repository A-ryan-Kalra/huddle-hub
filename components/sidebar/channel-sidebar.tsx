import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { FilePen } from "lucide-react";
import { redirect } from "next/navigation";
import ActionToolTip from "../ui/action-tooltip";
import ServerDropDown from "../channels/server-drop-down";
import ChannelSection from "./channel-section";
import { MemberRole } from "@prisma/client";

interface ChannelSideBarProps {
  serverId: string;
}
async function ChannelSidebar({ serverId }: ChannelSideBarProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        include: {
          members: true,
        },
      },
      members: true,
    },
  });

  if (!server) {
    redirect("/");
  }
  const channels = await db.channel.findMany({
    where: {
      serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  const currentMember = server.members.find(
    (member) => member.profileId === profile.id
  );

  const role: MemberRole = currentMember!.role;
  console.log(currentMember);
  console.log(role);
  return (
    <div className="truncate p-2 flex flex-col gap-y-2  h-full overflow-hidden">
      <div className="flex justify-between items-center">
        <ServerDropDown server={server} />
        <ActionToolTip label="New message">
          <div className="hover:bg-zinc-200 duration-300 transition rounded-md p-2 cursor-pointer">
            <FilePen className="w-5 h-5" />
          </div>
        </ActionToolTip>
      </div>

      <ChannelSection
        title={"Channels"}
        type="channels"
        channels={channels}
        role={role}
      />
    </div>
  );
}

export default ChannelSidebar;
