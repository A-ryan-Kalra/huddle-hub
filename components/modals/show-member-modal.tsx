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
import {
  member as memberType,
  memberRole,
  profile,
  server,
} from "@prisma/client";

import AvatarIcon from "../ui/avatar-icon";
import ActionToolTip from "../ui/action-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import axios from "axios";

const memberRoleIcon = {
  [memberRole.ADMIN]: <ShieldAlert className="w-4 h-4 text-red-500" />,
  [memberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 text-blue-500" />,
  [memberRole.GUEST]: null,
};

function ShowChannelMemberModal() {
  const { type, onClose, data, onOpen } = useModal();
  const {
    member: members,
    server,
    channelId,
    currentMember,
    name,
  } = data as {
    member: (memberType & { profile: profile })[];
    server: server;
    channelId: string;
    currentMember: memberType & { profile: profile };
    name: string;
  };
  const openModal = type === "showChannelMembers";
  const [loadingId, setLoadingId] = useState("");
  const router = useRouter();

  const handleCancel = () => {
    onClose();
    setLoadingId("");
  };

  const onLeaveChannel = async (id: string) => {
    try {
      setLoadingId(id);
      const url = queryString.stringifyUrl({
        url: `/api/channels/${channelId}/kick`,
        query: {
          memberId: id,
          serverId: server.id,
        },
      });

      await axios.put(url);

      onOpen("showChannelMembers", { member: data?.member });

      setLoadingId("");

      await fetch("/api/socket/reload"); // reload pages
      // router.push("/");
      router.refresh();
      handleCancel();
    } catch (error) {
      console.error(error);
      setLoadingId("");
    }
  };

  const canRemove =
    currentMember?.role === memberRole.ADMIN ||
    currentMember?.role === memberRole.MODERATOR;

  return (
    <Dialog open={openModal} onOpenChange={handleCancel}>
      <DialogContent className=" overflow-hidden">
        <DialogTitle className="text-2xl text-center">
          Total Members
        </DialogTitle>
        <DialogDescription className="text-center text-zinc-500 text-sm">
          {members?.length + (members?.length > 0 ? " Members" : " Member")}
        </DialogDescription>
        <div className="w-full relative overflow-y-auto flex flex-col gap-y-3 h-full max-h-[200px]">
          {members &&
            members?.length > 0 &&
            members?.map((member: memberType & { profile: profile }, index) => {
              const isHigherRole =
                member.role === memberRole.ADMIN ||
                member.role === memberRole.MODERATOR;

              return (
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
                    {canRemove && name !== "general" && (
                      <>
                        {!isHigherRole && member.id !== loadingId && (
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
                                  onClick={() => onLeaveChannel(member.id)}
                                >
                                  <Gavel className="w-4 h-4 " />
                                  Kick
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </>
                    )}

                    {!canRemove && name !== "general" && (
                      <>
                        {!isHigherRole &&
                          currentMember?.id === member?.id &&
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
                                    onClick={() => onLeaveChannel(member.id)}
                                  >
                                    Leave Channel
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                      </>
                    )}
                    {loadingId === member.id && (
                      <Loader2 className="w-4 h-4 ml-auto animate-spin" />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShowChannelMemberModal;
