import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChannelSidebar from "./sidebar/channel-sidebar";
import NavigationSidebar from "./sidebar/navigation-sidebar";

interface MobileToggleProps {
  children: React.ReactNode;
  serverId: string;
  currentMemberId: string;
}

export function MobileToggle({
  children,
  serverId,
  currentMemberId,
}: MobileToggleProps) {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="" side="left">
        <div className="flex h-full">
          <div className="w-16 border-r-[1px] border-gray-200">
            <NavigationSidebar currentMemberId={currentMemberId} />
          </div>
          <ChannelSidebar serverId={serverId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
