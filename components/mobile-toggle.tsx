import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChannelSidebar from "./sidebar/channel-sidebar";

interface MobileToggleProps {
  children: React.ReactNode;
  serverId: string;
}

export function MobileToggle({ children, serverId }: MobileToggleProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left">
        <ChannelSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
}
