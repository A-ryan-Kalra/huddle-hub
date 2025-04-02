import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export async function PUT(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const serverId = req.nextUrl.pathname.split("/")[3];
    console.log("serverId==", serverId);
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server id missing" }, { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        inviteCode: uuidv4(),
      },
      include: {
        members: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID>INVITE_CODE] GET", error);
    return NextResponse.json(
      { error: "Inernal Server Error" },
      { status: 500 }
    );
  }
}
