import { Member, Message, Profile } from "@prisma/client";
import React from "react";
import AvatarIcon from "./avatar-icon";

interface UserCommentProps {
  message: Message & { member: Member & { profile: Profile } };
}

function UserComment({ message }: UserCommentProps) {
  return (
    <div className="flex px-4 py-">
      <div className="relative flex gap-x-2  items-start">
        <AvatarIcon
          imageUrl={message?.member?.profile?.imageUrl}
          width={40}
          height={40}
          className="!rounded-md border-[1px] border-current  !sticky top-0"
        />
        <div className="flex flex-col">
          <div className="flex items-center justify-start">
            <h1 className="text-sm font-semibold hover:underline cursor-pointer transition">
              {message?.member?.profile?.name}
            </h1>
            <span>22</span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: message?.content }} />
        </div>
      </div>
    </div>
  );
}

export default UserComment;
