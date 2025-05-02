"use client";
import {
  Calculator,
  Calendar,
  CreditCard,
  Hash,
  Lock,
  Mic,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Smile,
  User,
  Video,
} from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useModal } from "@/hooks/use-modal-store";
import {
  channel,
  channelOnMember,
  channelType,
  channelVisibility,
  member,
  memberRole,
  profile,
  server,
} from "@prisma/client";
import ActionToolTip from "../ui/action-tooltip";
import AvatarIcon from "../ui/avatar-icon";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const channelIconVisibilityType = {
  [channelVisibility.PUBLIC]: <Hash className="w-4 h-4" />,
  [channelVisibility.PRIVATE]: <Lock className="w-4 h-4" />,
};
const channelTypeIcon = {
  [channelType.AUDIO]: <Mic className="w-4 h-4" />,
  [channelType.VIDEO]: <Video className="w-4 h-4" />,
  [channelType.TEXT]: null,
};
const memberRoleIcon = {
  [memberRole.ADMIN]: <ShieldAlert className="w-4 h-4 text-red-500" />,
  [memberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 text-blue-500" />,
  [memberRole.GUEST]: null,
};

export function SearchModal() {
  const { data, type, onClose } = useModal();
  const router = useRouter();
  const isModalOpen = type === "searchModal";
  const { server, member } = data as {
    server: server & {
      channels: (channel & { members: channelOnMember[] })[];
    } & {
      members: (member & { profile: profile })[];
    };
    member: member;
  };

  return (
    <CommandDialog open={isModalOpen} onOpenChange={onClose}>
      <CommandInput
        className="border-none outline-none focus-visible:ring-0 "
        placeholder="Type a command or search..."
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading={"Channel"}>
          {server?.channels?.map((channel, index) => {
            const accessToPrivateChannel =
              channel.visibility === "PRIVATE" &&
              channel.members.some(
                (member1) => member1.memberId === member?.id
              );

            const onClick = (
              channel: channel & { members: channelOnMember[] }
            ) => {
              if (!accessToPrivateChannel && channel.visibility === "PRIVATE") {
                toast("Unauthorized Access", {
                  description: "Oops! This channel is private",
                  style: { backgroundColor: "white", color: "black" },
                  richColors: true,
                });
                return null;
              }
              router.push(`/servers/${server.id}/channels/${channel.id}`);
              onClose();
            };

            if (!channel) {
              return null;
            }

            return (
              <CommandItem
                onSelect={() => onClick(channel)}
                key={index}
                className="cursor-pointer"
                value={`${channel.name}-${channel.id}`}
              >
                {channelIconVisibilityType[channel.visibility]}
                <span>{channel.name}</span>
                <ActionToolTip side="right" label={channel.type}>
                  {channelTypeIcon[channel.type]}
                </ActionToolTip>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={"Members"}>
          {server?.members
            ?.filter((profile) => profile?.profileId !== member?.profileId)
            ?.map((member, index) => {
              if (!member) {
                return null;
              }
              return (
                <CommandItem
                  key={index}
                  className="cursor-pointer"
                  onSelect={() => {
                    router.push(
                      `/servers/${server.id}/conversations/${member.id}`
                    );
                    onClose();
                  }}
                  value={`${member.profile.name}-${member.id}`}
                >
                  <div className="relative">
                    <AvatarIcon
                      imageUrl={member.profile.imageUrl}
                      height={40}
                      width={40}
                    />
                  </div>
                  <span>{member.profile.name}</span>
                  <ActionToolTip side="right" label={member.role}>
                    {memberRoleIcon[member.role]}
                  </ActionToolTip>
                </CommandItem>
              );
            })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
