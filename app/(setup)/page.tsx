import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Header from "@/components/landing-page/header/header";
import HeroPage from "@/components/landing-page/hero/hero";
import FeaturePages from "@/components/landing-page/feature/feature";
import Footer from "@/components/landing-page/footer";
import { currentUser } from "@clerk/nextjs/server";
import { initialProfile } from "@/lib/initialProfile";

export default async function Home() {
  const user = await currentUser();
  if (user) {
    const profile = await initialProfile();

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
      <Footer />
    </main>
  );
}
