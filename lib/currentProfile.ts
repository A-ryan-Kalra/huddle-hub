import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export const currentProfile = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }
  const profile = await db.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  return profile;
};
