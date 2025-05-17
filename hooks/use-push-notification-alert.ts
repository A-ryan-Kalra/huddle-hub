import { useSocket } from "@/components/providers/socket-providers";
import { sendNotification } from "@/components/push-notifications/action";
import { useEffect } from "react";

interface PushNotificationAlertProps {
  notificationId: string;
}
function usePushNotificationAlert({
  notificationId,
}: PushNotificationAlertProps) {
  const { isConnected, socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }
    console.log("notificationId", notificationId);
    socket?.on(notificationId, async (message) => {
      await sendNotification({ ...message, notificationId });
    });

    return () => {
      socket.off(notificationId);
    };
  }, [notificationId, socket, isConnected]);
}

export default usePushNotificationAlert;
