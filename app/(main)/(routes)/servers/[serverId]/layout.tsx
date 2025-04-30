import ChatThreads from "@/components/chat/chat-threads";
import ChannelSidebar from "@/components/sidebar/channel-sidebar";
import NavigationSidebar from "@/components/sidebar/navigation-sidebar";
import ResizeComponent from "@/components/ui/resize-component";

interface ServersLayoutProps {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}

async function ServersLayout({ children, params }: ServersLayoutProps) {
  const paramsResolved = await params;
  const { serverId } = paramsResolved;

  return (
    <div className="w-full h-full  flex">
      <div className="max-md:hidden">
        <NavigationSidebar />
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
