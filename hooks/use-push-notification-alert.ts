import { useSocket } from "@/components/providers/socket-providers";
import { sendNotification } from "@/components/push-notifications/action";
import { useEffect } from "react";
import { toast } from "sonner";

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
      let res;
      if (message?.subscription) {
        try {
          res = await sendNotification({ ...message, notificationId });

          if (!res.success) {
            throw new Error(res.error);
          }
        } catch (error) {
          console.error("Failed to send notification " + error);
          toast("Error", {
            description: `Error Occured at: ` + error,
            style: { backgroundColor: "white", color: "black" },
            richColors: true,
          });
        }
      }
    });

    return () => {
      socket.off(notificationId);
    };
  }, [notificationId, socket, isConnected]);
}

export default usePushNotificationAlert;
