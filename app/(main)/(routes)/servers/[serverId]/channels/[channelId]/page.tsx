import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { profile } from "console";
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
    <div className=" h-full">
      <ChatHeader type="channel" channel={channel} />
    </div>
  );
}

export default ChannelPage;
