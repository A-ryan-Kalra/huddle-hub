import ChatEditor from "@/components/chat/chat-editor";
import ChatHeader from "@/components/chat/chat-header";
import ChatSection from "@/components/chat/chat-section";
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
}
async function ConversationPage({ params }: ConversationPageProps) {
  const paramsResolved = await params;
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

  // console.log(conversation);
  // console.log(anotherMember);
  return (
    <div className="flex flex-col flex-1 h-full">
      <ChatHeader type="message" member={anotherMember} />
      <ChatSection
        type="conversation"
        chatId={conversation?.id}
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
    </div>
  );
}

export default ConversationPage;
