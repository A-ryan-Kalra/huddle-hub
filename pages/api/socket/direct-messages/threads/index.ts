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
    const { serverId, conversationId, directMessageId } = req.query;

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
    if (!directMessageId) {
      return res.status(400).json({ error: "Direct Message Id Missing" });
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

    const threads = await db.threads.create({
      data: {
        directMessageId: directMessageId,
        content: content as string,
        memberId: currentMember?.id,
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

    const channelKey = `chat:${directMessageId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, threads);

    return res.status(201).json(threads);
  } catch (error) {
    console.error("[API>SOCKET>DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
