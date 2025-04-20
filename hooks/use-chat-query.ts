import queryString from "query-string";
import { useSocket } from "@/components/providers/socket-providers";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface ChatQueryProps {
  queryKey: string;
  paramKey: string;
  paramValue: string;
  apiUrl: string;
}

function useChatQuery({
  paramKey,
  paramValue,
  queryKey,
  apiUrl,
}: ChatQueryProps) {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = queryString.stringifyUrl({
      url: apiUrl,
      query: {
        [paramKey]: paramValue,
        cursor: pageParam,
      },
    });

    const res = await fetch(url);

    return res.json();
  };

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,

      getNextPageParam: (lastpage: { nextCursor: string | any }) =>
        lastpage?.nextCursor,
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
