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
    include: {
      profile: true,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      <ChatHeader type="channel" channel={channel} />
      <ChatSection
        type="channel"
        chatId={channel?.id}
        name={channel?.profile?.name?.split(" ")[0]}
        createdAt={channel?.createdAt?.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        chatName={channel?.name}
        apiUrl="/api/messages"
        paramKey={"channelId"}
        paramValue={channel?.id}
        socketQuery={{
          channelId: channel?.id,
          serverId: paramsResolved.serverId,
        }}
        currentMember={member}
      />
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
