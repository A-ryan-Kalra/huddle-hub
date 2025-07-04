import ChatEditor from "@/components/chat/chat-editor";
import ChatHeader from "@/components/chat/chat-header";
import ChatSection from "@/components/chat/chat-section";
import { MediaRoom } from "@/components/ui/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

interface ConversationPageProps {
  params: Promise<{
    serverId: string;
    memberId: string;
  }>;
  searchParams: Promise<{
    video?: boolean;
  }>;
}
async function ConversationPage({
  params,
  searchParams,
}: ConversationPageProps) {
  const paramsResolved = await params;
  const searchParamsResolved = await searchParams;

  console.log(searchParamsResolved);
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile?.id,
      serverId: paramsResolved.serverId,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) {
    return redirect(`/servers/${paramsResolved?.serverId}`);
  }

  const conversation = await getOrCreateConversation(
    currentMember?.id as string,
    paramsResolved.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${paramsResolved.serverId}`);
  }

  const anotherMember =
    conversation?.conversationInitiaterId === paramsResolved?.memberId
      ? conversation?.conversationInitiator
      : conversation?.conversationReceiver;

  return (
    <div className="flex flex-col flex-1 h-full">
      <ChatHeader
        type="message"
        member={anotherMember}
        currentMemberId={currentMember?.id}
      />
      {!searchParamsResolved?.video && (
        <>
          <ChatSection
            type="conversation"
            chatId={conversation?.id}
            triggerChatId={conversation?.id}
            name={anotherMember?.profile?.name?.split(" ")[0]}
            chatName={anotherMember?.profile?.name?.split(" ")[0]}
            apiUrl="/api/direct-messages"
            paramKey={"conversationId"}
            paramValue={conversation?.id}
            socketQuery={{
              conversationId: conversation?.id,
              serverId: paramsResolved.serverId,
            }}
            currentMember={currentMember}
          />
          <ChatEditor
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              serverId: paramsResolved?.serverId,
              conversationId: conversation?.id,
            }}
            name={anotherMember?.profile?.name as string}
          />
        </>
      )}
      {searchParamsResolved?.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
    </div>
  );
}

export default ConversationPage;
