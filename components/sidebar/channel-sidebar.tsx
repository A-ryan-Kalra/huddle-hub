import { db } from "@/lib/db";
import { FilePen, RefreshCcw } from "lucide-react";
import { redirect } from "next/navigation";
import ActionToolTip from "../ui/action-tooltip";
import ServerDropDown from "../channels/server-drop-down";
import CommunicationSection from "./communication-section";
import { memberRole } from "@prisma/client";
import { currentProfile } from "@/lib/currentProfile";
import Refresh from "../ui/refresh";
import PushNotification from "@/components/push-notifications/push-notification";

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
          serverId,
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        include: {
          members: {
            include: {
              member: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
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
  const allServers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
    include: {
      members: true,
      channels: { include: { members: true } },
    },
  });

  const currentMember = server.members.filter(
    (member) => member.profileId === profile.id
  );

  const role: memberRole = currentMember[0]!.role;

  const allMembers = await db.member.findMany({
    where: {
      serverId,
      profileId: {
        not: profile.id,
      },
    },
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="truncate max-lg:w-full p-2 flex flex-col gap-y-2 w-full  h-full overflow-hidden">
      <div className="flex relative justify-between items-center">
        <ServerDropDown
          server={server}
          allServers={allServers}
          role={role}
          currentMember={currentMember[0]}
        />
        <PushNotification currentMemberId={currentMember[0]?.id} />
      </div>

      <CommunicationSection
        title={"Channels"}
        type="channels"
        channels={server.channels}
        role={role}
        allMembers={allMembers}
        currentMember={currentMember[0]}
      />
      <CommunicationSection
        title={"Members"}
        type="conversation"
        members={allMembers}
        role={role}
        allMembers={allMembers}
        currentMember={currentMember[0]}
        server={server}
      />
    </div>
  );
}

export default ChannelSidebar;
