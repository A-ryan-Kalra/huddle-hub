import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
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
          in: [MemberRole.ADMIN],
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

    console.log("channelOwner=", channelOwner);
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

      console.log("private==", addAllMemberToNewChannel);

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
    console.log("allmembers==", allMembers);
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

    console.log(addAllMemberToNewChannel);

    return NextResponse.json({ addAllMemberToNewChannel, success: true });
  } catch (error) {
    console.error("[CHANNELS]>[CHANNEL_ID_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
