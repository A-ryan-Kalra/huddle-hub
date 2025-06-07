import InitialModal from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initialProfile";

export default async function Home() {
  const profile = await initialProfile();

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
  } else if (profile && !server) {
    redirect(`/servers/create-server`);
  }

  return <InitialModal />;
}
