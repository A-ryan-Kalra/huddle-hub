import { currentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/type";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    const profile = await currentProfilePages(req);
    const { serverId, conversationId } = req.query;

    const { content, fileUrl } = req.body;

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
        ...(fileUrl && { fileUrl }),
      },
      include: {
        conversation: {
          include: {
            conversationInitiator: {
              include: {
                profile: true,
              },
            },
            conversationReceiver: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    const chat = `chat:${conversationId}:chat`;

    res?.socket?.server?.io?.emit(chat, directMessage);

    return res.json({ directMessage });
  } catch (error) {
    console.error("[API>SOCKET>DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
