import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { memberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const channelId = req.nextUrl.pathname.split("/").pop();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    const { type, name, visibility, members } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server id missing" }, { status: 400 });
    }
    if (!channelId) {
      return NextResponse.json(
        { error: "Channel id missing" },
        { status: 400 }
      );
    }

    if (name === "general") {
      return NextResponse.json(
        { error: "Name cannot be 'general'" },
        { status: 400 }
      );
    }

    const adminMember = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId,
        role: {
          in: [memberRole.ADMIN, memberRole.MODERATOR],
        },
      },
    });

    let channelOwner;
    if (!adminMember) {
      channelOwner = await db.channel.findUnique({
        where: {
          id: channelId,
          profileId: profile.id,
        },
      });
    }

    if (!channelOwner && !adminMember) {
      return NextResponse.json(
        {
          error: "Channel not found or you don't have permission to update it.",
          success: false,
        },
        { status: 403 }
      );
    }

    if (visibility === "PRIVATE") {
      const channelOwnerMember = await db.member.findFirst({
        where: {
          profileId: profile.id,
          serverId,
        },
      });
      members.push(channelOwnerMember?.id);
      const channel = await db.channel.update({
        where: {
          id: channelId,
        },
        data: {
          name,
          type,
          visibility,
        },
        select: {
          id: true,
        },
      });

      await db.channelOnMember.deleteMany({
        where: {
          channelId,
        },
      });
      const addAllMemberToNewChannel = await db.channelOnMember.createMany({
        data: members.map((id: string) => ({
          serverId,
          memberId: id,
          channelId: channel.id,
        })),
        skipDuplicates: true,
      });

      return NextResponse.json({ addAllMemberToNewChannel, success: true });
    }
    await db.channel.update({
      where: {
        id: channelId,
      },
      data: {
        name,
        type,
        visibility,
      },
      select: {
        id: true,
      },
    });

    const allMembers = await db.member.findMany({
      where: {
        serverId,
      },
      select: {
        id: true,
      },
    });
    await db.channelOnMember.deleteMany({
      where: {
        channelId,
      },
    });

    const addAllMemberToNewChannel = await db.channelOnMember.createMany({
      data: allMembers.map((member) => ({
        serverId,
        memberId: member.id,
        channelId,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ addAllMemberToNewChannel, success: true });
  } catch (error) {
    console.error("[CHANNELS]>[CHANNEL_ID_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const channelId = req.nextUrl.pathname.split("/").pop();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server id missing" }, { status: 400 });
    }
    if (!channelId) {
      return NextResponse.json(
        { error: "Channel id missing" },
        { status: 400 }
      );
    }

    await db.channelOnMember.deleteMany({
      where: {
        channelId,
      },
    });

    const deleteChannel = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [memberRole.ADMIN, memberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            OR: [
              {
                profileId: profile.id,
              },
              {
                profileId: { not: profile.id },
              },
            ],
          },
        },
      },
    });

    return NextResponse.json({ deleteChannel, success: true });
  } catch (error) {
    console.error("[CHANNELS]>[CHANNEL_ID_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
