import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import {
  conversation,
  directMessage,
  member,
  notification,
  notificationRecipient,
} from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let allNotifications: (notificationRecipient & {
      member: member;
      notification: notification;
    })[];

    if (cursor) {
      allNotifications = await db.notificationRecipient.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          member: {
            profileId: profile?.id,
          },
          serverId: serverId as string,
        },
        include: {
          notification: {
            include: {
              notificationSent: {
                include: {
                  profile: true,
                },
              },
            },
          },
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
      allNotifications = await db.notificationRecipient.findMany({
        take: MESSAGES_BATCH,
        where: {
          member: {
            profileId: profile?.id,
          },
          serverId: serverId as string,
        },
        include: {
          notification: {
            include: {
              notificationSent: {
                include: {
                  profile: true,
                },
              },
            },
          },
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
    }

    const notReadTotal = await db.notificationRecipient.count({
      where: {
        member: {
          profileId: profile.id,
        },
        serverId: serverId as string,
        isRead: false,
      },
    });

    let nextCursor = undefined;
    if (allNotifications.length === MESSAGES_BATCH) {
      nextCursor = allNotifications[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: allNotifications,
      nextCursor,
      notReadTotal,
    });
  } catch (error) {
    console.error("[NOTIFICATIONS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
