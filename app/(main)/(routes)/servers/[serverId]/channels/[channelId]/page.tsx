import ChatEditor from "@/components/chat/chat-editor";
import ChatHeader from "@/components/chat/chat-header";
import ChatSection from "@/components/chat/chat-section";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import React from "react";

interface ChannelPageProps {
  params: Promise<{
    channelId: string;
    serverId: string;
  }>;
}

async function ChannelPage({ params }: ChannelPageProps) {
  const paramsResolved = await params;
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  console.log(paramsResolved);
  const channel = await db.channel.findUnique({
    where: {
      id: paramsResolved.channelId,
      serverId: paramsResolved.serverId,
    },
    include: {
      members: true,
      profile: true,
    },
  });

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: paramsResolved.serverId,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      <ChatHeader type="channel" channel={channel} />
      <ChatSection type="channel" channel={channel} />
      <ChatEditor
        type="channel"
        apiUrl="/api/socket/messages"
        query={{ serverId: channel?.serverId, channelId: channel?.id }}
        visibility={channel?.visibility}
        name={channel?.name}
      />
    </div>
  );
}

export default ChannelPage;
