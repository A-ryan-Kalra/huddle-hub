import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { message, threads } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");
    const cursor = searchParams.get("cursor");

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 500 });
    }

    if (!messageId) {
      return NextResponse.json(
        { error: "Message Id is missing" },
        { status: 500 }
      );
    }

    let messages: threads[];
    if (cursor) {
      messages = await db.threads.findMany({
        where: {
          messageId,
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
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.threads.findMany({
        take: MESSAGE_BATCH,
        where: {
          messageId,
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
