import { useSocket } from "@/components/providers/socket-providers";
import { member, notificationRecipient, profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface NotificationSocketProps {
  addKey: string;
  queryKey: string;
  notReadTotal: (count: number) => void;
}
type MessageWithMember = notificationRecipient & {
  member: member & { profile: profile };
};

function useNotificationSocket({
  addKey,
  queryKey,
  notReadTotal,
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

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        notReadTotal(1);

        // queryClient.refetchQueries({queryKey:[queryKey]});
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
  }, [addKey, isConnected, queryKey, socket, notReadTotal]);
}

export default useNotificationSocket;
