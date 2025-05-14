import { useSocket } from "@/components/providers/socket-providers";
import { member, message, profile } from "@prisma/client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface ChatSockerProps {
  addKey: string;
  queryKey?: string;
  updateKey?: string;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  type?: "channel" | "conversation" | "threads";
  triggerKey?: string;
}
type MessageWithMember = message & {
  member: member & { profile: profile };
};

function useChatSocket({
  addKey,
  queryKey,
  updateKey,
  audioRef,
  type,
  triggerKey,
}: ChatSockerProps) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket?.on(addKey, (message: MessageWithMember) => {
      if (!message) {
        queryClient.refetchQueries({ queryKey: [triggerKey] });
      }
      if (message) {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return { pages: [{ items: [message] }] };
          }
          const newData = [...oldData.pages];

          audioRef?.current?.play().catch((err) => {
            console.warn("Playback failed:", err);
          });
          newData[0] = {
            ...newData[0],
            items: [message, ...newData[0].items],
          };

          // queryClient.refetchQueries();

          return {
            ...oldData,
            pages: newData,
          };
        });
      }
    });

    socket?.on(updateKey as string, (message: MessageWithMember) => {
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
  }, [isConnected, queryKey, addKey, updateKey, type, audioRef]);
}

export default useChatSocket;
