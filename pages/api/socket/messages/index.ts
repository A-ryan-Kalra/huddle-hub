import { channel } from "diagnostics_channel";
import { currentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/type";
import { NextApiRequest } from "next";
import { notificationType } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    const profile = await currentProfilePages(req);
    const { serverId, channelId } = req.query;
    const { content, fileUrl } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server Id is Missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "Channel Id is Missing" });
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server does not exist" });
    }

    const member = server.members.filter(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: "Member does not exist in server" });
    }

    const channel = await db.channel.findUnique({
      where: {
        id: channelId as string,
        serverId: serverId as string,
        members: {
          some: {
            memberId: member[0].id as string,
          },
        },
      },
    });

    if (!channel) {
      return res
        .status(404)
        .json({ error: "Channel does not exist in server" });
    }

    const message = await db.message.create({
      data: {
        memberId: member[0].id as string,
        channelId: channel.id as string,
        ...(content && { content: content }),
        ...(fileUrl && { fileUrl }),
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
    const allMembers = await db.member.findMany({
      where: {
        profileId: {
          not: profile?.id,
        },
        channels: {
          some: {
            channelId: channelId as string,
          },
        },
      },
    });

    const notification = await db.notification.create({
      data: {
        message: `You have a new message from ${profile.name} in ${channel?.name} channel`,
        type: notificationType.MESSAGE,
        typeId: message.id as string,
        content,
        channel_direct_messageId: message?.channelId,
        senderId: member[0]?.id,
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
                notificaionSent: {
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

    const channelKey = `chat:${channel.id}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);
    notification?.recipients?.forEach((member) => {
      const notificationQueryKey = `notification:${member.memberId}:newAlert`;

      res?.socket?.server?.io?.emit(notificationQueryKey, member);
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("[SOCKET>API>MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
