import { useSocket } from "@/components/providers/socket-providers";
import { useEffect } from "react";

interface NotificationAlertProps {
  notificationId: string;
  countNotification: () => void;
}
function useNotificationAlert({
  notificationId,
  countNotification,
}: NotificationAlertProps) {
  const { isConnected, socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket?.on(notificationId, (alerts) => {
      countNotification();
    });

    return () => {
      socket.off(notificationId);
    };
  }, [notificationId, socket, isConnected, countNotification]);
}

export default useNotificationAlert;
