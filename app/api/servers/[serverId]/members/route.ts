import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const serverId = req.nextUrl.pathname.split("/")[3];
    const { role } = await req.json();
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server id missing" }, { status: 400 });
    }
    if (!memberId) {
      return NextResponse.json({ error: "Member id missing" }, { status: 400 });
    }
    if (!role) {
      return NextResponse.json(
        {
          error: "Type is Missing",
        },
        {
          status: 400,
        }
      );
    }

    const server = await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
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

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER]>[CHANNEL_PATCH]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const serverId = req.nextUrl.pathname.split("/")[3];
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server id missing" }, { status: 400 });
    }
    if (!memberId) {
      return NextResponse.json({ error: "Member id missing" }, { status: 400 });
    }

    await db.channelOnMember.deleteMany({
      where: {
        serverId,
        memberId,
      },
    });

    const server = await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        members: {
          delete: {
            id: memberId,
            profileId: {
              not: profile.id,
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

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER]>[CHANNEL_DELETE]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
