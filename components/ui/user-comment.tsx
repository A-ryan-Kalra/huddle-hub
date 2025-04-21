import { Member, Message, Profile } from "@prisma/client";
import React from "react";
import AvatarIcon from "./avatar-icon";
import { Edit, TrashIcon } from "lucide-react";
import { Button } from "./button";
import ActionToolTip from "./action-tooltip";

interface UserCommentProps {
  message: Message & { member: Member & { profile: Profile } };
  createdAt: string;
}

function UserComment({ message, createdAt }: UserCommentProps) {
  return (
    <div className="flex px-4 py-1 h-full ">
      <div className="relative flex gap-x-2 w-full  items-start">
        <AvatarIcon
          imageUrl={message?.member?.profile?.imageUrl}
          width={40}
          height={40}
          className="!rounded-md border-[1px] border-current  !sticky top-0"
        />
        <div className="flex flex-col w-full hover:bg-zinc-100 group transition rounded-md relative">
          <div className="gap-x-1 z-10 absolute right-3 p-1 bg-zinc-300 -top-4 hidden rounded-md group-hover:flex">
            <ActionToolTip
              label="Edit"
              className="px-2 py-1 hover:bg-zinc-200 "
            >
              <Edit className="!w-4 !h-4" />
            </ActionToolTip>
            <ActionToolTip
              label="Delete"
              className="px-2 py-1 hover:bg-zinc-200 "
            >
              <TrashIcon className="!w-4 !h-4" />
            </ActionToolTip>
          </div>
          <div className="flex items-center justify-start">
            <h1 className="text-sm font-semibold hover:underline cursor-pointer transition">
              {message?.member?.profile?.name}
            </h1>
            <span className="text-xs ml-3 text-zinc-500">{createdAt}</span>
          </div>
          <div
            className="w-full min-h-[40px]"
            dangerouslySetInnerHTML={{ __html: message?.content }}
          />
        </div>
      </div>
    </div>
  );
}

export default UserComment;
