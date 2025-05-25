import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const serverId = req.nextUrl.pathname.split("/")[3];

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server Id missing" }, { status: 400 });
    }

    await db.channelOnMember.deleteMany({
      where: {
        serverId,
        member: {
          profileId: profile.id,
        },
      },
    });
    const deleteMember = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
      },
      data: {
        members: {
          deleteMany: [
            {
              profileId: profile.id,
            },
          ],
        },
      },
    });
    return NextResponse.json(deleteMember);
  } catch (error) {
    console.error("[SERVERS]>[SERVER_ID_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
