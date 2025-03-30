import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export const currentProfile = async () => {
  const authorized = await auth();
  const { userId } = authorized;

  if (!userId) {
    return null;
  }
  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
