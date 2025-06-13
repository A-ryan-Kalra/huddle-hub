import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const { imageUrl, name } = await req.json();
    const serverId = req.nextUrl.pathname.split("/").pop();

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
        imageUrl,
        name,
      },
    });

    return NextResponse.json({ success: true, server });
  } catch (error) {
    console.error("[SERVERS]>[SERVER_ID_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const serverId = req.nextUrl.pathname.split("/").pop();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server Id missing" }, { status: 400 });
    }
    await db.channelOnMember.deleteMany({
      where: {
        serverId,
      },
    });

    const deleteMember = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
        members: {
          some: { role: "ADMIN" },
        },
      },
    });
    return NextResponse.json(deleteMember);
  } catch (error) {
    console.error("[SERVERS]>[SERVER_ID_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Errr" },
      { status: 500 }
    );
  }
}
