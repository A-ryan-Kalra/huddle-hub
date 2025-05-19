"use client";
import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

import {
  Check,
  EllipsisVertical,
  Gavel,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestionIcon,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { member, memberRole, profile, server } from "@prisma/client";

import AvatarIcon from "../ui/avatar-icon";
import ActionToolTip from "../ui/action-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import axios from "axios";
import { channel } from "diagnostics_channel";

const memberRoleIcon = {
  [memberRole.ADMIN]: <ShieldAlert className="w-4 h-4 text-red-500" />,
  [memberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 text-blue-500" />,
  [memberRole.GUEST]: null,
};

function ShowChannelMemberModal() {
  const { type, onClose, data, onOpen } = useModal();
  const openModal = type === "showChannelMembers";
  const [loadingId, setLoadingId] = useState("");
  const { member, server, channelId } = data as {
    member: (member & { profile: profile })[];
    server: server;
    channelId: string;
  };
  const router = useRouter();

  const addMember = async (id: string) => {
    try {
      setLoadingId(id);
      const url = queryString.stringifyUrl({
        url: `/api/channels/${channelId}/kick`,
        query: {
          memberId: id,
          serverId: server.id,
        },
      });

      const res = await axios.put(url);
      const data = res.data;
      console.log(data);
      onOpen("showChannelMembers", { member: data?.member });

      setLoadingId("");

      router.refresh();
    } catch (error) {
      console.error(error);
      setLoadingId("");
    }
  };

  const handleCancel = () => {
    onClose();
    setLoadingId("");
  };

  const onKick = async (id: string) => {
    try {
      setLoadingId(id);
      const url = queryString.stringifyUrl({
        url: `/api/channels/${channelId}/kick`,
        query: {
          memberId: id,
          serverId: server.id,
        },
      });

      const res = await axios.put(url);
      const data = res.data;
      console.log(data);
      onOpen("showChannelMembers", { member: data?.member });

      setLoadingId("");

      router.refresh();
    } catch (error) {
      console.error(error);
      setLoadingId("");
    }
  };
  console.log(member);
  return (
    <Dialog open={openModal} onOpenChange={handleCancel}>
      <DialogContent className=" overflow-hidden">
        <DialogTitle className="text-2xl text-center">
          Total Members
        </DialogTitle>
        <DialogDescription className="text-center text-zinc-500 text-sm">
          {member?.length + (member?.length > 0 ? " Members" : " Member")}
        </DialogDescription>
        <div className="w-full relative overflow-y-auto flex flex-col gap-y-3 h-full max-h-[200px]">
          {member?.map((member, index) => (
            <div key={index} className="flex gap-x-2 items-center">
              <AvatarIcon
                imageUrl={member?.profile?.imageUrl}
                height={40}
                width={40}
              />
              <div className="flex flex-col">
                <div className="flex gap-x-3 items-center">
                  <h1 className="text-xs font-semibold">
                    {member?.profile?.name}
                  </h1>
                  <ActionToolTip label={member.role}>
                    {memberRoleIcon[member.role]}
                  </ActionToolTip>
                </div>
                <p className="text-sm text-zinc-500">
                  {member?.profile?.email}
                </p>
              </div>
              <div className="ml-auto p-2 ">
                {server?.profileId !== member?.profileId &&
                  member.id !== loadingId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="rounded-md p-1 hover:bg-zinc-100 transition">
                        <EllipsisVertical className="w-3 h-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="right"
                        align="start"
                        className=""
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className="hover:bg-zinc-200"
                            onClick={() => onKick(member.id)}
                          >
                            <Gavel className="w-4 h-4 " />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                {loadingId === member.id && (
                  <Loader2 className="w-4 h-4 ml-auto animate-spin" />
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShowChannelMemberModal;
