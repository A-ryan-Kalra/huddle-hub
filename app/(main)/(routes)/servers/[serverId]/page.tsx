import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerPageProps {
  params: Promise<{
    serverId: string;
  }>;
}

async function ServerPage({ params }: ServerPageProps) {
  const paramsResolved = await params;

  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await db.server.findUnique({
    where: {
      id: paramsResolved?.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
      channels: {
        some: {
          name: "general",
        },
      },
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  if (!server) {
    return redirect("/");
  }

  return redirect(`/servers/${server.id}/channels/${server.channels[0].id}`);
}

export default ServerPage;
