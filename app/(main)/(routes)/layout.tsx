import ChannelSidebar from "@/components/sidebar/channel-sidebar";
import ResizeComponent from "@/components/ui/resize-component";

interface RoutesLayoutProps {
  children: React.ReactNode;
}

function RoutesLayout({ children }: RoutesLayoutProps) {
  return (
    <div className="w-full h-full flex">
      <div className="min-w-[70px] h-full "></div>
      <div className="flex w-full h-full pr-1 pb-2 rounded-2xl  overflow-hidden">
        <ResizeComponent>
          <ChannelSidebar />
        </ResizeComponent>
        <div className="bg-slate-200 w-ful flex flex-col flex-1 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export default RoutesLayout;
