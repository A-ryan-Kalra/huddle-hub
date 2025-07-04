import { directMessage, member, message, profile } from "@prisma/client";
import React from "react";
import AvatarIcon from "../ui/avatar-icon";
import ActionToolTip from "../ui/action-tooltip";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

interface MainThreadProps {
  message: {
    id: string;
    content: string | null;
    fileUrl: string | null;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    memberId: string;
    channelId?: string;
    conversationId?: string;
    member: member & { profile: profile };
  };
}

const TIME_FORMAT = "hh:mm a";
const DATE_FORMAT = "d/MM/yyyy, hh:mm a";

function MainThread({ message }: MainThreadProps) {
  const showTime = format(new Date(message?.createdAt), TIME_FORMAT);
  const showDate = format(new Date(message?.createdAt), DATE_FORMAT);

  return (
    <div className="mt-7 w-full px-1">
      <div className="flex items-start w-full gap-x-4 ">
        <AvatarIcon
          imageUrl={message?.member?.profile?.imageUrl}
          width={36}
          height={34}
          className="!rounded-md aspect-square ring-2 ring-offset-1 ring-zinc-600"
        />
        <div className="flex flex-col gap-y-2 max-sm:gap-y-1 w-full">
          <div className="flex items-center -mt-1 justify-start">
            <h1 className="text-sm  font-semibold hover:underline cursor-pointer transition">
              {message?.member?.profile?.name}
            </h1>

            <ActionToolTip
              label={showDate}
              className="text-xs ml-3 text-zinc-500 hover:underline"
            >
              {showTime}
            </ActionToolTip>
          </div>
          <div
            className="w-full break-all line-clamp-4 max-sm:text-sm"
            dangerouslySetInnerHTML={{ __html: message?.content as string }}
          />
          {message?.fileUrl && (
            <div className="relative max-sm:max-w-[200px] max-w-full shadow-sm shadow-current max-h-[200px] rounded-lg overflow-hidden">
              <Link
                href={message?.fileUrl}
                draggable="false"
                target="_blank"
                rel="noopener noreferrer"
                className="relative"
              >
                <Image
                  src={message?.fileUrl}
                  alt="message"
                  width={300}
                  height={300}
                  loading="lazy"
                  className=" object-cover w-full h-fit aspect-video hover:scale-110 cursor-pointer transition"
                  // fill
                />
              </Link>
            </div>
          )}

          <hr className="border-[1px] my-1 w-full" />
        </div>
      </div>
    </div>
  );
}

export default MainThread;
