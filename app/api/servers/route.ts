import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { imageUrl, name } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        imageUrl,
        name,
        inviteCode: uuid(),
        members: {
          create: [
            {
              profileId: profile.id,
              role: "ADMIN",
            },
          ],
        },
        channels: {
          create: [
            {
              visibility: "PUBLIC",
              name: "genreal",
              profileId: profile.id,
              type: "TEXT",
            },
          ],
        },
      },
      include: {
        members: true,
        channels: true,
      },
    });

    const memberId = server.members[0]?.id;

    const addMembersToChannel = await db.channelOnMember.create({
      data: {
        serverId: server.id,
        memberId: memberId,
        channelId: server.channels[0]?.id,
      },
    });

    return NextResponse.json({ server, addMembersToChannel });
  } catch (error) {
    console.error("[SERVERS_PATCH]", error);
    return NextResponse.json(
      { error: "Inernal Server Error" },
      { status: 500 }
    );
  }
}
