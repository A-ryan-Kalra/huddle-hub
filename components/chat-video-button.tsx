"use client";

import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import React from "react";
import ActionToolTip from "./ui/action-tooltip";

function ChatVideoButton() {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");
  const onCLick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathName || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      {
        skipNull: true,
      }
    );

    router.push(url);
  };

  const Icon = isVideo ? VideoOff : Video;
  const toolTipLabel = isVideo ? "End video call" : "Start video call";

  return (
    <ActionToolTip side="bottom" label={toolTipLabel}>
      <button onClick={onCLick} className="hover:opacity-75 transition  mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionToolTip>
  );
}

export default ChatVideoButton;
