import { Member, Message, Profile } from "@prisma/client";
import React from "react";
import AvatarIcon from "./avatar-icon";

interface UserCommentProps {
  message: Message & { member: Member & { profile: Profile } };
  createdAt: string;
}

function UserComment({ message, createdAt }: UserCommentProps) {
  return (
    <div className="flex px-4 py-1">
      <div className="relative flex gap-x-2 w-full  items-start">
        <AvatarIcon
          imageUrl={message?.member?.profile?.imageUrl}
          width={40}
          height={40}
          className="!rounded-md border-[1px] border-current  !sticky top-0"
        />
        <div className="flex flex-col w-full hover:bg-zinc-100 transition rounded-md overflow-hidden">
          <div className="flex items-center justify-start">
            <h1 className="text-sm font-semibold hover:underline cursor-pointer transition">
              {message?.member?.profile?.name}
            </h1>
            <span className="text-xs ml-3 text-zinc-500">{createdAt}</span>
          </div>
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: message?.content }}
          />
        </div>
      </div>
    </div>
  );
}

export default UserComment;
