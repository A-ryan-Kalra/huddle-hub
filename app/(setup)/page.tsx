import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/currentProfile";
import Image from "next/image";
import Header from "@/components/landing-page/header";
import HeroPage from "@/components/landing-page/hero";

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
    <main className="bg-[#F2FCF8]  w-full h-[110vh] relative">
      <Header />
      <section className="">
        <HeroPage />
      </section>
    </main>
  );
}
