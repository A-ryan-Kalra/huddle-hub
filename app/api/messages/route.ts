import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");
    const cursor = searchParams.get("cursor");

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 500 });
    }

    if (!channelId) {
      return NextResponse.json(
        { error: "Channel Id is missing" },
        { status: 500 }
      );
    }

    let messages: message[];
    if (cursor) {
      messages = await db.message.findMany({
        where: {
          channelId,
        },
        take: MESSAGE_BATCH,
        cursor: {
          id: cursor as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          threads: {
            include: {
              message: true,
              member: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        where: {
          channelId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          threads: {
            include: {
              message: true,
              member: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }
    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
