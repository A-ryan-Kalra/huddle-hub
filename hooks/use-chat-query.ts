import queryString from "query-string";
import { useSocket } from "@/components/providers/socket-providers";
import { useInfiniteQuery } from "@tanstack/react-query";

import {
  member,
  message,
  notification,
  notificationRecipient,
  profile,
} from "@prisma/client";

interface ChatQueryProps {
  queryKey: string;
  paramKey?: string;
  paramValue?: string;
  apiUrl: string;
  type?: string;
  serverId: string;
}

function useChatQuery({
  paramKey,
  paramValue,
  queryKey,
  apiUrl,
  type,
  serverId,
}: ChatQueryProps) {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = queryString.stringifyUrl(
      {
        url: apiUrl,
        query: {
          [paramKey as string]: paramValue,
          cursor: pageParam,
          serverId: serverId,
        },
      },
      {
        skipNull: true,
      }
    );

    const res = await fetch(url);

    return res.json();
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,

    getNextPageParam: (lastpage: {
      nextCursor: string | any;
      items: (message &
        notificationRecipient & {
          replyToMessage: message & {
            member: member & { profile: profile };
          };
          member: member & { profile: profile };
          notification: notification & {
            notificationSent: member & { profile: profile };
          };
        })[];
      notReadTotal?: number;
    }) => lastpage?.nextCursor,
    initialPageParam: undefined,
    refetchInterval: isConnected ? false : 1000,
  });

  return {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    refetch,
  };
}

export default useChatQuery;
