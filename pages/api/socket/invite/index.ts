import { currentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/type";
import { notificationType } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    const profile = await currentProfilePages(req);

    const { memberId, serverId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!memberId) {
      return res.status(400).json({ error: "Member Id missing" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "ServerId Id missing" });
    }

    const allMembers = await db.member.findMany({
      where: {
        profileId: {
          not: profile?.id,
        },
        serverId: serverId as string,
      },
    });

    const currentMember = await db.member.findFirst({
      where: {
        profileId: profile?.id,
        serverId: serverId as string,
      },
      include: {
        channels: {
          where: {
            channel: {
              name: "general",
            },
          },
          include: {
            channel: true,
          },
        },
      },
    });

    if (!currentMember?.isInvitedComplete) {
      return res.status(200).json({ success: true });
    }
    const notification = await db.notification.create({
      data: {
        message: `${profile.name} joined this server 🎊`,
        type: notificationType.INVITE,
        typeId: memberId as string,
        content: `Give ${profile.name?.split(" ")[0]} a warm welcome!`,
        communicationType: "DIRECT_MESSAGE",
        channel_direct_messageId: memberId as string,
        senderId: memberId as string,
        recipients: {
          create: allMembers?.map((member, index) => ({
            memberId: member?.id,
            serverId: serverId as string,
          })),
        },
      },
      include: {
        recipients: {
          include: {
            member: {
              include: {
                profile: true,
              },
            },
            notification: {
              include: {
                notificationSent: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    await db.member.update({
      where: {
        id: memberId as string,
        serverId: serverId as string,
      },
      data: {
        isInvitedComplete: false,
      },
    });

    notification?.recipients?.forEach((member) => {
      const notificationQueryKey = `notification:${member.memberId}:newAlert`;

      res?.socket?.server?.io?.emit(notificationQueryKey, member);
    });

    const greetNotification = await db.notification.create({
      data: {
        message: `Hi ${profile.name?.split(" ")[0]}, welcome aboard! 🎊`,
        type: notificationType.INVITE,
        typeId: memberId as string,
        content: `Let the fun begin!`,
        communicationType: "CHANNEL",
        channel_direct_messageId: currentMember?.channels[0].channel
          ?.id as string,
        senderId: memberId as string,
        recipients: {
          create: {
            memberId: memberId as string,
            serverId: serverId as string,
          },
        },
      },
      include: {
        recipients: {
          include: {
            member: {
              include: {
                profile: true,
              },
            },
            notification: {
              include: {
                notificationSent: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const notificationQueryKey = `notification:${currentMember.id}:newAlert`;

    res?.socket?.server?.io?.emit(
      notificationQueryKey,
      greetNotification.recipients[0]
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[SOCKET>API>INVITE_GET]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
