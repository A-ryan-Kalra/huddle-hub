import { useSocket } from "@/components/providers/socket-providers";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface ChatSockerProps {
  addKey: string;
  queryKey: string;
}
type MessageWithMember = Message & {
  member: Member & { profile: Profile };
};

function useChatSocket({ addKey, queryKey }: ChatSockerProps) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket?.on(addKey, (message: MessageWithMember) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages) {
          return { pages: [{ items: [message] }] };
        }

        console.log("oldData=", oldData);
        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      // socket.off(u);
    };
  }, [isConnected, queryKey, addKey]);
}

export default useChatSocket;
