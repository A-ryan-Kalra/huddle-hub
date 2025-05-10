import { currentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/type";
import { communicationType, notificationType } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    const profile = await currentProfilePages(req);
    const { serverId, conversationId } = req.query;

    const { content, fileUrl, replyToMessageId } = req.body;
    console.log("replyToMessageId=", replyToMessageId);

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "Server Id Missing" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation Id Missing" });
    }

    const currentMember = await db.member.findFirst({
      where: {
        profileId: profile?.id,
        serverId: serverId as string,
      },
    });

    if (!currentMember) {
      return res
        .status(401)
        .json({ error: "Unauthorized, you are not a member of this server." });
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId as string,
      },
      include: {
        conversationInitiator: { include: { profile: true } },
        conversationReceiver: { include: { profile: true } },
      },
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation does not exist" });
    }

    const directMessage = await db.directMessage.create({
      data: {
        conversationId: conversation?.id,
        content: content as string,
        memberId: currentMember?.id,
        ...(fileUrl && { fileUrl }),
        ...(replyToMessageId && { replyToMessageId: replyToMessageId }),
      },
      include: {
        replyToMessage: {
          include: {
            member: {
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
    const chat = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(chat, directMessage);
    const reciever =
      currentMember.id === conversation?.conversationInitiaterId
        ? conversation.conversationReceiverId
        : conversation.conversationInitiaterId;

    const notification = await db.notification.create({
      data: {
        message: `You have a new message from ${profile.name}`,
        type: notificationType.DIRECT_MESSAGE,
        content,
        typeId: conversationId as string,
        channel_direct_messageId: currentMember?.id,
        senderId: currentMember?.id,
        communicationType: communicationType.DIRECT_MESSAGE,
        recipients: {
          create: [
            {
              memberId: reciever,
            },
          ],
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

    const notify = `${currentMember?.id}${reciever}`;
    const notificationQueryKey = `notification:${reciever}:newAlert`;

    res?.socket?.server?.io?.emit(notify);
    res?.socket?.server?.io?.emit(
      notificationQueryKey,
      notification.recipients[0]
    );

    return res.json({ directMessage });
  } catch (error) {
    console.error("[API>SOCKET>DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
