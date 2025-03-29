import InitialModal from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const profile = await currentProfile();

  if (!profile) {
    return <RedirectToSignIn />;
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
}
