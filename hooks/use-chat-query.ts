import queryString from "query-string";
import { useSocket } from "@/components/providers/socket-providers";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
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
}

function useChatQuery({
  paramKey,
  paramValue,
  queryKey,
  apiUrl,
  type,
}: ChatQueryProps) {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = queryString.stringifyUrl(
      {
        url: apiUrl,
        query: {
          [paramKey as string]: paramValue,
          cursor: pageParam,
        },
      },
      {
        skipNull: true,
      }
    );

    const res = await fetch(url);

    return res.json();
  };

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,

      getNextPageParam: (lastpage: {
        nextCursor: string | any;
        items: (message &
          notificationRecipient & {
            member: member & { profile: profile };
            notification: notification & {
              notificaionSent: member & { profile: profile };
            };
          })[];
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
  };
}

export default useChatQuery;
