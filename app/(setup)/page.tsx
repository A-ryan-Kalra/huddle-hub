import InitialModal from "@/components/modals/initial-modal";
import { initialProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

export default async function Home() {
  const profile = await initialProfile();

  // const server=await db.server.findFirst({
  //   where:{
  //     members:{
  //       some:{

  //       }
  //     }
  //   }
  // })

  return <InitialModal />;
}
