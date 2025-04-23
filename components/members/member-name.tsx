import { Member, Profile } from "@prisma/client";
import ActionToolTip from "../ui/action-tooltip";
import AvatarIcon from "../ui/avatar-icon";

interface MemberNameProps {
  member: Member & { profile: Profile };
}

function MemberName({ member }: MemberNameProps) {
  console.log(member);
  return (
    <div className="p-1  cursor-pointer hover:bg-zinc-200 duration-300 transition text-sm rounded-md w-full">
      <div className="flex gap-x-2 items-center">
        <div className="flex items-center justify-start gap-x-1 w-full ">
          <AvatarIcon
            imageUrl={member?.profile?.imageUrl}
            width={20}
            height={20}
          />

          <h1 className="px-1 flex items-center text-neutral-900">
            {member?.profile?.name}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default MemberName;
