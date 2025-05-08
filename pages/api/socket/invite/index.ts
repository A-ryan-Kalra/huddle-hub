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
    });

    if (!currentMember?.isInvitedComplete) {
      console.log("wait wut??");
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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[SOCKET>API>INVITE_GET]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
