import { currentProfile } from "@/lib/currentProfile";
import { redirect } from "next/navigation";

async function CommunicationSidebar() {
  const profile = await currentProfile();
  console.log(profile);
  if (!profile) {
    return redirect("/");
  }

  return (
    <div className="truncate w-full h-full">
      <div></div>
    </div>
  );
}

export default CommunicationSidebar;
