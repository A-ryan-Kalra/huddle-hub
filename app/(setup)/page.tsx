import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/currentProfile";

import Header from "@/components/landing-page/header/header";
import HeroPage from "@/components/landing-page/hero/hero";
import FeaturePages from "@/components/landing-page/feature/feature";

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

    if (server) {
      redirect(`/servers/${server.id}`);
    } else if (profile && !server) {
      redirect(`/servers/create-server`);
    }
  }

  return (
    <main className="bg-[#F2FCF8]  w-full min-h-screen relative">
      <Header />
      <section className="bg-inherit">
        <HeroPage />
      </section>
      <section className="bg-white">
        <FeaturePages />
      </section>
    </main>
  );
}
