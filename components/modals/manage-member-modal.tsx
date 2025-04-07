"use client";
import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

import qs from "query-string";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Check,
  EllipsisVertical,
  Gavel,
  Loader2,
  SettingsIcon,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestionIcon,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { Member, MemberRole, Profile, Server } from "@prisma/client";

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

const memberRoleIcon = {
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 text-red-500" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 text-blue-500" />,
  [MemberRole.GUEST]: null,
};

function ManageMemberModal() {
  const { type, onClose, data, onOpen } = useModal();
  const openModal = type === "customizeMember";
  const [loadingId, setLoadingId] = useState("");
  const { server } = data as {
    server: Server & { members: (Member & { profile: Profile })[] };
  };
  const router = useRouter();

  const handleRole = async (id: string, role: "MODERATOR" | "GUEST") => {
    console.log(role);
    try {
      setLoadingId(id);
      const url = qs.stringifyUrl({
        url: `/api/servers/${server?.id}/members`,
        query: { memberId: id },
      });

      const res = await axios.patch(url, { role });
      const data = res.data;
      setLoadingId("");
      onOpen("customizeMember", { server: data });
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
    console.log(type);
    try {
      setLoadingId(id);
      const url = qs.stringifyUrl({
        url: `/api/servers/${server?.id}/members`,
        query: {
          memberId: id,
        },
      });

      const res = await axios.delete(url);
      const data = res.data;
      onOpen("customizeMember", { server: data });

      setLoadingId("");

      router.refresh();
    } catch (error) {
      console.error(error);
      setLoadingId("");
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={handleCancel}>
      <DialogContent className=" overflow-hidden">
        <DialogTitle className="text-2xl text-center">
          Manage Members
        </DialogTitle>
        <DialogDescription className="text-center text-zinc-500 text-sm">
          {server?.members?.length +
            (server?.members?.length > 0 ? " Members" : " Member")}
        </DialogDescription>
        <div className="w-full relative overflow-y-auto flex flex-col gap-y-3 h-full max-h-[200px]">
          {server?.members?.map((member, index) => (
            <div key={index} className="flex gap-x-2 items-center">
              <AvatarIcon
                imageUrl={member?.profile?.imageUrl}
                height={40}
                width={40}
              />
              <div className="flex flex-col">
                <div className="flex gap-x-3 items-center">
                  <h1 className="text-xs font-semibold">
                    {member.profile.name}
                  </h1>
                  <ActionToolTip label={member.role}>
                    {memberRoleIcon[member.role]}
                  </ActionToolTip>
                </div>
                <p className="text-sm text-zinc-500">{member.profile.email}</p>
              </div>
              <div className="ml-auto p-2 ">
                {server.profileId !== member.profileId &&
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
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <ShieldQuestionIcon className="w-4 h-4 mr-2" />
                              Role
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() => handleRole(member.id, "GUEST")}
                                >
                                  Guest{" "}
                                  {member.role === "GUEST" && (
                                    <Check className="w-4 h-4" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRole(member.id, "MODERATOR")
                                  }
                                >
                                  Moderator{" "}
                                  {member.role === "MODERATOR" && (
                                    <Check className="w-4 h-4" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onKick(member.id)}>
                            <Gavel className="w-4 h-4" />
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

export default ManageMemberModal;
