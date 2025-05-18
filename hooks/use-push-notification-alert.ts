import { useSocket } from "@/components/providers/socket-providers";
import { sendNotification } from "@/components/push-notifications/action";
import { useEffect } from "react";

interface PushNotificationAlertProps {
  notificationId: string;
}
interface PushNotificationProps {
  title?: string;
  description: string;
  subscription: PushSubscription | any;
}

function usePushNotificationAlert({
  notificationId,
}: PushNotificationAlertProps) {
  const { isConnected, socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket?.on(notificationId, async (message: PushNotificationProps) => {
      if (message?.subscription)
        await sendNotification({ ...message, notificationId });
    });

    return () => {
      socket.off(notificationId);
    };
  }, [notificationId, socket, isConnected]);
}

export default usePushNotificationAlert;
