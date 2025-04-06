"use client";
import React, { useEffect, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../ui/file-upload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import qs from "query-string";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
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
import { ScrollArea } from "../ui/scroll-area";
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
  const { type, onClose, data } = useModal();
  const openModal = type === "customizeMember";
  const { server } = data as {
    server: Server & { members: (Member & { profile: Profile })[] };
  };
  const router = useRouter();

  const onSubmit = async () => {
    const url = qs.stringifyUrl({
      url: `/api/servers/${server?.id}`,
    });

    await axios.patch(url);

    router.refresh();
    onClose();
  };

  const handleCancel = () => {
    onClose();
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
              {member.role !== "ADMIN" && (
                <button className="ml-auto px-2 py-1 rounded-md  hover:bg-zinc-100 transition">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="">
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
                              <DropdownMenuItem>Guest</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Moderator</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Gavel className="w-4 h-4" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageMemberModal;
