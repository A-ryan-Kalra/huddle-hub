import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { FilePen } from "lucide-react";
import { redirect } from "next/navigation";
import ActionToolTip from "../ui/action-tooltip";
import ServerDropDown from "../channels/server-drop-down";

async function ChannelSidebar() {
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

  return (
    <div className="truncate p-2 flex flex-col gap-y-2 w-full h-full overflow-hidden">
      <div className="flex justify-between items-center">
        <ServerDropDown server={server} />
        <ActionToolTip label="New message">
          <div className="hover:bg-zinc-200 duration-300 transition rounded-md p-2 cursor-pointer">
            <FilePen className="w-5 h-5" />
          </div>
        </ActionToolTip>
      </div>

      <div></div>
    </div>
  );
}

export default ChannelSidebar;
