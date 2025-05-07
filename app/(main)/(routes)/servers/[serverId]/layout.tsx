import ChatThreads from "@/components/chat/chat-threads";
import ChannelSidebar from "@/components/sidebar/channel-sidebar";
import NavigationSidebar from "@/components/sidebar/navigation-sidebar";
import ResizeComponent from "@/components/ui/resize-component";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServersLayoutProps {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}

async function ServersLayout({ children, params }: ServersLayoutProps) {
  const profile = await currentProfile();
  const paramsResolved = await params;
  const { serverId } = paramsResolved;

  const currentMember = await db.member.findFirst({
    where: {
      serverId: serverId as string,
      profileId: profile?.id,
    },
  });

  if (!currentMember) {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full h-full  flex">
      <div className="max-lg:hidden">
        <NavigationSidebar currentMemberId={currentMember.id} />
      </div>
      <div className="flex w-full h-full   rounded-2xl border-[1px] border-gray-300 overflow-hidden">
        <ResizeComponent>
          <ChannelSidebar serverId={serverId} />
        </ResizeComponent>
        <div className="w-full flex-1 h-full ">{children}</div>
      </div>
    </div>
  );
}

export default ServersLayout;
