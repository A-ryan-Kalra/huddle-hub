import { useSocket } from "@/components/providers/socket-providers";
import { useEffect } from "react";

interface ReloadProps {
  memberId: string;
  reloadPage: () => void;
}
function useReload({ memberId, reloadPage }: ReloadProps) {
  const { isConnected, socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket?.on("refresh", () => {
      reloadPage();
    });

    return () => {
      socket.off("refresh");
    };
  }, [memberId, socket, isConnected, reloadPage]);
}

export default useReload;
