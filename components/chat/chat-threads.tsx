import { useModal } from "@/hooks/use-modal-store";
import { X, XCircle } from "lucide-react";
import React from "react";
import MainThread from "../threads/main-thread";
import { Member, Message, Profile } from "@prisma/client";
import ChatEditor from "./chat-editor";

function ChatThreads() {
  const { type, data, onClose } = useModal();
  const { message } = data as {
    message: Message & { member: Member & { profile: Profile } };
  };
  console.log({ type, data });
  return (
    <div className="w-full h-full p-2 bg-white border-l-[1px]">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Thread</h1>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-200 transition-all rounded-full"
        >
          <XCircle className=" w-5 h-5" />
        </button>
      </div>
      <MainThread message={message} />
      <ChatEditor
        type="channel"
        apiUrl="/api/socket/messages/threads"
        query={{
          messageId: message?.id,
          serverId: message?.member?.serverId,
          channelId: message?.channelId,
        }}
        name={""}
      />
    </div>
  );
}

export default ChatThreads;
