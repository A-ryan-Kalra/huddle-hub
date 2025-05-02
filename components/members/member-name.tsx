import { member, profile } from "@prisma/client";
import AvatarIcon from "../ui/avatar-icon";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";

interface MemberNameProps {
  member: member & { profile: profile };
}

function MemberName({ member }: MemberNameProps) {
  const { onClose } = useModal();
  const router = useRouter();
  const params = useParams();
  function routeToMemberPage() {
    router.push(`/servers/${member.serverId}/conversations/${member.id}`);
    onClose();
  }
  return (
    <div
      onClick={routeToMemberPage}
      className={cn(
        "p-1  cursor-pointer hover:bg-zinc-200  duration-300 transition text-sm rounded-md w-full",
        params?.memberId === member.id && "bg-zinc-300 hover:bg-zinc-300"
      )}
    >
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
