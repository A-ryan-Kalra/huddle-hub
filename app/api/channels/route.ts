import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    console.log("serverId==", serverId);

    const { name, type } = await req.json();

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

    const allMembers = await db.member.findMany({
      select: {
        id: true,
      },
    });
    console.log("allmembers", allMembers);
    const channel = await db.channel.create({
      data: {
        profileId: profile.id,
        serverId,
        name,
        type,
        visibility: "PUBLIC",
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

    console.log(addAllMemberToNewChannel);

    return NextResponse.json({ addAllMemberToNewChannel, success: true });
  } catch (error) {
    console.error("[CHANNELS_POST", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
