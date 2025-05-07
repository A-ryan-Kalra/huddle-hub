import { useEffect } from "react";

interface ChatScrollProps {
  chatRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  loadMore: () => void;
  shouldLoadMore: boolean;
  count: number;
}

function useChatScroll({
  bottomRef,
  chatRef,
  shouldLoadMore,
  loadMore,
  count,
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

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;

    function checkDistance() {
      if (!topDiv) {
        return false;
      }
      const distanceFromBottom =
        topDiv?.scrollHeight - (topDiv?.clientHeight + topDiv?.scrollTop) >= 50;
      return distanceFromBottom;
    }

    if (checkDistance()) {
      bottomDiv?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [bottomRef, loadMore, count]);
}

export default useChatScroll;
