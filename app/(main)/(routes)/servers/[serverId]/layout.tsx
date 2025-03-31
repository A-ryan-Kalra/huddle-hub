import ChannelSidebar from "@/components/sidebar/channel-sidebar";
import ResizeComponent from "@/components/ui/resize-component";

interface ServersLayoutProps {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}

async function ServersLayout({ children, params }: ServersLayoutProps) {
  const paramsResolved = await params;
  const { serverId } = paramsResolved;

  return (
    <div className="w-full h-full flex">
      <div className="min-w-[70px] h-full "></div>
      <div className="flex w-full h-full pr-1 pb-2 rounded-2xl  overflow-hidden">
        <ResizeComponent>
          <ChannelSidebar serverId={serverId} />
        </ResizeComponent>
        <div className="bg-slate-200 w-ful flex flex-col flex-1 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ServersLayout;
