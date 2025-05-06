import { useModal } from "@/hooks/use-modal-store";
import { X, XCircle } from "lucide-react";
import React from "react";
import MainThread from "../threads/main-thread";
import { directMessage, member, message, profile } from "@prisma/client";
import ChatEditor from "./chat-editor";
import ChatSection from "./chat-section";

interface ChatThreadsProps {
  params: Record<string, any> | null;
}
interface ChatMessage {
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
}

function ChatThreads({ params }: ChatThreadsProps) {
  const { type, data, onClose } = useModal();
  const { message } = params?.member
    ? (data as { message: ChatMessage })
    : (data as { message: ChatMessage });

  return (
    <div className="w-full h-full flex flex-col flex- p-2 bg-white border-l-[1px]">
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
      <ChatSection
        type="threads"
        chatId={message?.id}
        triggerChatId={message?.channelId || message?.conversationId}
        name={message?.member?.profile?.name?.split(" ")[0]}
        createdAt={
          message?.createdAt
            ? new Date(message.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""
        }
        apiUrl={
          params?.channelId
            ? "/api/messages/threads"
            : "/api/direct-messages/threads"
        }
        paramKey={params?.channelId ? "messageId" : "directMessageId"}
        paramValue={message?.id}
        socketQuery={{
          channelId: message?.channelId,
          messageId: message?.id,
          serverId: message?.member?.serverId,
        }}
        currentMember={message?.member}
      />
      <ChatEditor
        type="threads"
        apiUrl={
          params?.channelId
            ? "/api/socket/messages/threads"
            : "/api/socket/direct-messages/threads"
        }
        query={{
          ...(params?.channelId && { messageId: message?.id }),
          ...(params?.channelId && { channelId: message?.channelId }),
          ...(params?.memberId && { directMessageId: message?.id }),
          ...(params?.memberId && { conversationId: message?.conversationId }),
          ...(message?.member && { messageOwnerId: message?.memberId }),
          serverId: message?.member?.serverId,
        }}
        name={""}
      />
    </div>
  );
}

export default ChatThreads;
