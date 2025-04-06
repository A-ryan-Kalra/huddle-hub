import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { FilePen } from "lucide-react";
import { redirect } from "next/navigation";
import ActionToolTip from "../ui/action-tooltip";
import ServerDropDown from "../channels/server-drop-down";
import CommunicationSection from "./communication-section";
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
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!server) {
    redirect("/");
  }
  const channels = await db.channel.findMany({
    where: {
      serverId,
    },
    include: {
      members: true,
    },
  });

  const currentMember = server.members.filter(
    (member) => member.profileId === profile.id
  );

  const role: MemberRole = currentMember[0]!.role;
  const allMembers = await db.member.findMany({
    where: {
      serverId,
      profileId: { not: profile.id },
    },
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  // console.log("currentMember", currentMember);
  return (
    <div className="truncate p-2 flex flex-col gap-y-2  h-full overflow-hidden">
      <div className="flex justify-between items-center">
        <ServerDropDown server={server} role={role} />
        <ActionToolTip label="New message">
          <div className="hover:bg-zinc-200 duration-300 transition rounded-md p-2 cursor-pointer">
            <FilePen className="w-5 h-5" />
          </div>
        </ActionToolTip>
      </div>

      <CommunicationSection
        title={"Channels"}
        type="channels"
        channels={server.channels}
        role={role}
        allMembers={allMembers}
        currentMember={currentMember[0]}
      />
    </div>
  );
}

export default ChannelSidebar;
