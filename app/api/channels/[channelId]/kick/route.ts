import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const channelId = req.nextUrl.pathname.split("/")[3];
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server id missing" }, { status: 400 });
    }
    if (!memberId) {
      return NextResponse.json({ error: "Member id missing" }, { status: 400 });
    }
    if (!channelId) {
      return NextResponse.json(
        { error: "Channel id missing" },
        { status: 400 }
      );
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        channelOnMembers: {
          some: {
            channelId,
            serverId,
            memberId,
          },
        },
      },
      data: {
        channelOnMembers: {
          delete: {
            memberId_channelId_serverId: {
              memberId: memberId as string,
              channelId: channelId,
              serverId: serverId,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json({ member: server.members });
  } catch (error) {
    console.error("Internal Server Error");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
