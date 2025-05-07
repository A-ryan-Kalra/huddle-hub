import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { memberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    const { name, type, visibility, members } = await req.json();

    if (name === "general") {
      return NextResponse.json(
        { error: "Name cannot be 'general'" },
        { status: 401 }
      );
    }

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server id missing" }, { status: 401 });
    }

    if (visibility === "PRIVATE") {
      const channelOwnerMember = await db.member.findFirst({
        where: {
          profileId: profile.id,
          serverId,
          role: {
            in: [memberRole.ADMIN, memberRole.MODERATOR],
          },
        },
      });
      members.push(channelOwnerMember?.id);

      const channel = await db.channel.create({
        data: {
          profileId: profile.id,
          serverId,
          name,
          type,
          visibility,
        },
        select: {
          id: true,
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

    const allMembers = await db.member.findMany({
      where: {
        serverId,
      },
      select: {
        id: true,
      },
    });

    const channel = await db.channel.create({
      data: {
        profileId: profile.id,
        serverId,
        name,
        type,
        visibility,
      },
      select: {
        id: true,
      },
    });

    const addAllMemberToNewChannel = await db.channelOnMember.createMany({
      data: allMembers.map((member) => ({
        serverId,
        memberId: member.id,
        channelId: channel.id,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ addAllMemberToNewChannel, success: true });
  } catch (error) {
    console.error("[CHANNELS_POST", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
