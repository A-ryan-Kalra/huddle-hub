import { member, profile } from "@prisma/client";
import AvatarIcon from "../ui/avatar-icon";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";
import useNotificationAlert from "@/hooks/use-notification-alert";
import { useState } from "react";

interface MemberNameProps {
  member: member & { profile: profile };
  currentMember: member;
}

function MemberName({ member, currentMember }: MemberNameProps) {
  const { onClose } = useModal();
  const router = useRouter();
  const params = useParams();
  const [totalNotification, setTotalNotifications] = useState(0);

  useNotificationAlert({
    notificationId:
      member.id === params?.memberId ? "" : member.id + currentMember?.id,
    countNotification: () => setTotalNotifications((prev) => prev + 1),
  });

  function routeToMemberPage() {
    router.push(`/servers/${member.serverId}/conversations/${member.id}`);
    onClose();
    setTotalNotifications(0);
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
        <div className="relative flex items-center justify-start gap-x-1 w-full ">
          <AvatarIcon
            imageUrl={member?.profile?.imageUrl}
            width={20}
            height={20}
          />
          {totalNotification > 0 && (
            <div className="flex  items-center gap-x-1 size-3  absolute top-1 right-3">
              <span className=" flex size-3 ">
                <span className="absolute animate-ping inline-flex h-full w-full  rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
              </span>
              <h1>{totalNotification}</h1>
            </div>
          )}

          <h1 className="px-1 flex items-center text-neutral-900">
            {member?.profile?.name}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default MemberName;
