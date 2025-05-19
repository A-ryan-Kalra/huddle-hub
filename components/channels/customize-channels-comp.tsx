"use client";
import { Edit, Trash } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useModal } from "@/hooks/use-modal-store";
import {
  channel,
  channelOnMember,
  member,
  memberRole,
  profile,
} from "@prisma/client";

interface CustomizeChannelCompProps {
  children: React.ReactNode;
  allMembers: (member & { profile: profile })[];
  role: { admin: boolean; moderator: boolean };
  channel: channel & { members: channelOnMember[] };
  ownerOfChannel: boolean;
}

function CustomizeChannelComp({
  children,
  channel,
  allMembers,
  role,
  ownerOfChannel,
}: CustomizeChannelCompProps) {
  const { onOpen } = useModal();

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger className=" ">{children}</ContextMenuTrigger>
      {(ownerOfChannel || role.admin) && channel.name !== "general" && (
        <ContextMenuContent className="">
          <ContextMenuItem
            onClick={() =>
              onOpen("customizeChannel", { channel, member: allMembers })
            }
            className="flex items-center border-none outline-none focus-visible:ring-0"
          >
            <Edit className="w-4 h-4" /> Edit
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => onOpen("deleteChannel", { channel })}
            className="flex items-center border-none outline-none focus-visible:ring-0"
          >
            <Trash className="w-4 h-4 text-red-500" /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
}

export default CustomizeChannelComp;
