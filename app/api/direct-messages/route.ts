import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { Conversation, DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const cursor = searchParams.get("cursor");

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation Id Missing" },
        { status: 400 }
      );
    }

    let directMessages: (DirectMessage & { conversation: Conversation })[];

    if (cursor) {
      directMessages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId: conversationId,
        },
        include: {
          conversation: true,
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    } else {
      directMessages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId: conversationId,
        },
        include: {
          conversation: true,
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    let nextCursor = undefined;
    if (directMessages?.length === MESSAGES_BATCH) {
      nextCursor = directMessages[MESSAGES_BATCH - 1];
    }

    return NextResponse.json({ items: directMessages, nextCursor });
  } catch (error) {
    console.error("[DIRECT_MESSAGES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
