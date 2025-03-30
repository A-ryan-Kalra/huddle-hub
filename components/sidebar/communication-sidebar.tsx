import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChevronDown } from "lucide-react";
import { redirect } from "next/navigation";

async function CommunicationSidebar() {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
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

  console.log(server);

  if (!server) {
    redirect("/");
  }

  return (
    <div className="truncate p-2 flex flex-col gap-y-2 w-full h-full overflow-hidden">
      <div className="px-2 py-1 cursor-pointer hover:bg-zinc-200 duration-300 transition w-fit rounded-md">
        <h1 className="truncate  font-semibold text-lg font-sans flex items-center   ">
          {server?.name.split(" ")?.join("-")}{" "}
          <ChevronDown className="w-4 h-4" />
        </h1>
      </div>
    </div>
  );
}

export default CommunicationSidebar;
