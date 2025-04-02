import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InvitePageProps {
  params: Promise<{
    inviteCode: string;
  }>;
}

async function InvitePage({ params }: InvitePageProps) {
  const paramsResolved = await params;

  const profile = await currentProfile();

  if (!profile) {
    redirect("/");
  }

  const server = await db.server.findFirst({
    where: {
      inviteCode: paramsResolved.inviteCode,
    },
  });

  if (!server) {
    return (
      <div className="w-full h-full flex gap-y-5 items-center justify-center flex-col">
        <h1 className="text-8xl text-zinc-700">404</h1>
        <p className="text-lg text-zinc-400">
          Oops! The invite code is invalid. Please check and try again.
        </p>
      </div>
    );
  }

  const existingMember = await db.member.findFirst({
    where: {
      serverId: server.id,
      profileId: profile.id,
    },
  });

  if (existingMember) {
    return redirect(`/servers/${server.id}`);
  }
  const allChannels = await db.channel.findMany({
    where: {
      serverId: server.id,
      visibility: "PUBLIC",
    },
  });
  const memberData = allChannels.map((channel) => ({
    channelId: channel.id,
    serverId: server.id,
    profileId: profile.id,
  }));

  const data = await db.member.createMany({
    data: memberData,
    skipDuplicates: true,
  });

  console.log(data);
  return (
    <div className="w-full h-full flex gap-y-5 items-center justify-center flex-col">
      <h1 className="text-8xl text-zinc-700">404</h1>
      <p className="text-lg text-zinc-400">
        {!server
          ? "Oops! The invite code is invalid. Please check and try again."
          : "Oops! the page you are looking for doesn't exist."}
      </p>
    </div>
  );
}

export default InvitePage;
