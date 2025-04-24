import ChatHeader from "@/components/chat/chat-header";
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
  });

  const conversation = await getOrCreateConversation(
    currentMember?.id as string,
    paramsResolved.memberId
  );

  const anotherMember =
    conversation?.conversationInitiaterId === paramsResolved?.memberId
      ? conversation?.conversationInitiator
      : conversation?.conversationReceiver;

  // console.log(conversation);
  console.log(anotherMember);
  return (
    <div className="flex flex-col flex-1 h-full">
      <ChatHeader type="message" member={anotherMember} />
    </div>
  );
}

export default ConversationPage;
