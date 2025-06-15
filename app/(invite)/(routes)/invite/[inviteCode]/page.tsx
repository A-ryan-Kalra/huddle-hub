import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initialProfile";
import Link from "next/link";
import { redirect } from "next/navigation";

interface InvitePageProps {
  params: Promise<{
    inviteCode: string;
  }>;
}

async function InvitePage({ params }: InvitePageProps) {
  const paramsResolved = await params;

  const profile = await initialProfile();

  const existingserver = await db.server.findFirst({
    where: {
      inviteCode: paramsResolved.inviteCode,
    },
  });

  if (!existingserver) {
    return (
      <div className="w-full h-full flex gap-y-5 items-center justify-center flex-col">
        <h1 className="text-8xl text-zinc-700">404</h1>
        <p className="text-lg text-center text-zinc-400">
          Oops! The invite code is invalid.
          <br /> Please check and try again.
        </p>
        <Link href={"/"}>
          <Button variant={"ghost"} className="border-[1px]">
            Go Back
          </Button>
        </Link>
      </div>
    );
  }

  const existingMember = await db.member.findFirst({
    where: {
      serverId: existingserver.id,
      profileId: profile.id,
    },
  });

  if (existingMember) {
    return redirect(`/servers/${existingserver.id}`);
  }
  const newMember = await db.member.create({
    data: {
      profileId: profile.id,
      serverId: existingserver.id,
      role: "GUEST",
      isInvitedComplete: true,
    },
  });

  const allChannels = await db.channel.findMany({
    where: {
      serverId: existingserver.id,
      visibility: "PUBLIC",
    },
  });
  const addMemberToAllChannels = allChannels.map((channel) => ({
    channelId: channel.id,
    memberId: newMember.id,
  }));

  const server = await db.server.update({
    where: {
      inviteCode: paramsResolved.inviteCode,
    },
    data: {
      channelOnMembers: {
        createMany: {
          data: addMemberToAllChannels,
          skipDuplicates: true,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return (
    <div className="w-full h-full flex gap-y-5 items-center justify-center flex-col">
      <h1 className="text-8xl text-zinc-700">404</h1>
      <p className="text-lg text-zinc-400">
        {!server
          ? "Oops! The invite code is invalid. Please check and try again."
          : "Oops! the page you are looking for doesn't exist."}
      </p>
      <Link href={"/"}>
        <Button variant={"ghost"} className="border-[1px]">
          Go Back
        </Button>
      </Link>
    </div>
  );
}

export default InvitePage;
