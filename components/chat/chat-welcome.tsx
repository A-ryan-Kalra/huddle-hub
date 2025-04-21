import { Channel, ChannelOnMember, Profile } from "@prisma/client";
import { HashIcon } from "lucide-react";

interface ChatWelcomeProps {
  type: "channel" | "conversation";
  name: string;
  createdAt: string;
  chatName: string;
}

function ChatWelcome({ createdAt, name, type, chatName }: ChatWelcomeProps) {
  return (
    <div className="flex flex-col bg-blac gap-y-1 py-4 px-5 my-3">
      <h1 className="flex items-center text-2xl font-semibold">
        <HashIcon className="w-6 h-6" />
        {chatName}
      </h1>
      {type === "channel" ? (
        <p className="ml-1">
          <span className="">
            <span className="inline bg-blue-100 mr-1 text-nowrap text-blue-600">
              @{name}
            </span>
            created this channel on {createdAt}. This is the very beginning of
            the
          </span>{" "}
          <strong className="">
            <HashIcon className="inline mb-0.5 w-4 h-4" />
            {chatName}
          </strong>{" "}
          channel.
          {chatName === "general" &&
            " This is the one channel that will always include everyone. It's a great spot for announcements and team-wide conversations."}
        </p>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default ChatWelcome;
