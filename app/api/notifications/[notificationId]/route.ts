import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const notificationId = req.nextUrl.pathname.split("/").pop();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification Id missing" },
        { status: 400 }
      );
    }

    const checkRead = await db.notificationRecipient.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
    return NextResponse.json(checkRead);
  } catch (error) {
    console.error("[NOTIFICATIONS]>[NOTIFICATIONS_ID_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
