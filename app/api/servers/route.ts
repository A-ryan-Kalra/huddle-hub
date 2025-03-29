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
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id,
            },
          ],
        },
      },
      include: {
        channels: true,
      },
    });

    const channelId = server.channels[0]?.id;

    const member = await db.member.create({
      data: {
        serverId: server.id,
        channelId: channelId,
        profileId: profile.id,
      },
    });

    return NextResponse.json({ server, member });
  } catch (error) {
    console.error("[SERVERS_PATCH]", error);
    return NextResponse.json(
      { error: "Inernal Server Error" },
      { status: 500 }
    );
  }
}
