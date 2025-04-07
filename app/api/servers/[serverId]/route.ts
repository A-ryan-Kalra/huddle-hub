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
    console.log("password", serverId);

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server Id missing" }, { status: 400 });
    }

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
      { error: "Internal Server Errpr" },
      { status: 500 }
    );
  }
}
