import { useEffect } from "react";

interface ChatScrollProps {
  chatRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  loadMore: () => void;
  shouldLoadMore: boolean;
}

function useChatScroll({
  bottomRef,
  chatRef,
  shouldLoadMore,
  loadMore,
}: ChatScrollProps) {
  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      if (topDiv?.scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [chatRef, loadMore, shouldLoadMore]);
}

export default useChatScroll;
