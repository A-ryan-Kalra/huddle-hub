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
    const { serverId, channelId, messageId, messageOwnerId } = req.query;
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
    if (!messageId) {
      return res.status(400).json({ error: "Message Id is Missing" });
    }
    if (!messageOwnerId) {
      return res.status(400).json({ error: "Message Owner Id is Missing" });
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
        members: { include: { profile: true } },
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server does not exist" });
    }

    const member = server.members.filter(
      (member) => member.profileId === profile.id
    );
    const threadOwner = server.members.filter(
      (member) => member.id === messageOwnerId
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

    const threads = await db.threads.create({
      data: {
        memberId: member[0].id as string,
        messageId: messageId as string,
        messageOwnerId,
        ...(content && { content: content }),
        ...(fileUrl && { fileUrl }),
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${messageId}:messages`;
    const chatId = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(chatId);
    res?.socket?.server?.io?.emit(channelKey, threads);

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
        message: `${profile.name} replied to ${`${
          messageOwnerId === member[0].id
            ? "to their own comment"
            : `${threadOwner[0]?.profile?.name}'s`
        } comment`} in ${channel?.name} channel`,
        type: notificationType.REPLY,
        typeId: messageId as string,
        content,
        channel_direct_messageId: channelId as string,
        senderId: member[0]?.id,
        threadId: threads.id,
        threadMessageOwnerId: messageOwnerId as string,
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

    notification?.recipients?.forEach((member) => {
      const notificationQueryKey = `notification:${member.memberId}:newAlert`;
      const pushNotificationAlert = `push:${member.memberId}`;

      res?.socket?.server?.io?.emit(pushNotificationAlert, {
        title: `${profile.name} replied in a thread`,
        description: `You have a new thread in ${channel?.name} channel`,
        subscription: member?.member?.subscription,
      });
      res?.socket?.server?.io?.emit(notificationQueryKey, member);
    });

    return res.status(201).json(threads);
  } catch (error) {
    console.error("[SOCKET>API>THREADS_POST]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
