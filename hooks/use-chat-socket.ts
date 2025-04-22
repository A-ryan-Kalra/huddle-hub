import { useSocket } from "@/components/providers/socket-providers";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface ChatSockerProps {
  addKey: string;
  queryKey: string;
  updateKey: string;
}
type MessageWithMember = Message & {
  member: Member & { profile: Profile };
};

function useChatSocket({ addKey, queryKey, updateKey }: ChatSockerProps) {
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

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    socket?.on(updateKey, (message: MessageWithMember) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData?.pages?.map((page: any) => {
          return {
            ...page,
            items: page?.items?.map((memberWithMessage: any) => {
              if (memberWithMessage?.id === message.id) {
                return message;
              }
              return memberWithMessage;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [isConnected, queryKey, addKey, updateKey]);
}

export default useChatSocket;
