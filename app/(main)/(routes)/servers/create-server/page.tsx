import InitialModal from "@/components/modals/initial-modal";
import { initialProfile } from "@/lib/initialProfile";
import { RedirectToSignIn } from "@clerk/nextjs";

async function CreateServerPage() {
  const profile = await initialProfile();
  if (!profile) {
    return <RedirectToSignIn />;
  }

  return <InitialModal />;
}

export default CreateServerPage;
