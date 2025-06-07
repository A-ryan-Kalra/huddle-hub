import InitialModal from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initialProfile";
import NavbarPage from "@/components/landing-page/navbar";
import { currentProfile } from "@/lib/currentProfile";

export default async function Home() {
  const profile = await currentProfile();

  if (profile) {
    const server = await db.server.findFirst({
      where: {
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
    });
    console.log(server);

    if (server) {
      redirect(`/servers/${server.id}`);
    } else if (profile && !server) {
      redirect(`/servers/create-server`);
    }
  }

  return (
    <main>
      <nav>
        <NavbarPage />
      </nav>
    </main>
  );
}
