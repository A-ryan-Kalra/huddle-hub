import { useSocket } from "@/components/providers/socket-providers";
import {
  member,
  notification,
  notificationRecipient,
  profile,
} from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface NotificationSocketProps {
  addKey: string;
  queryKey: string;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}
type MessageWithMember = notificationRecipient & {
  member: member & { profile: profile };
  notification: notification & { notificationSent: member };
};

function useNotificationSocket({
  addKey,
  queryKey,
  audioRef,
}: NotificationSocketProps) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket?.on(addKey, (message: MessageWithMember) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return { pages: [{ items: [message] }] };
        }

        const newData = [...oldData.pages];
        queryClient.refetchQueries({ queryKey: [queryKey] });
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };
        if (message?.notification?.type === "INVITE") {
          audioRef?.current?.play().catch((err) => {
            console.warn("Playback failed:", err);
          });
        }

        // notReadTotal(1);

        // queryClient.refetchQueries();

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
    };
  }, [addKey, isConnected, queryKey, socket, audioRef]);
}

export default useNotificationSocket;
