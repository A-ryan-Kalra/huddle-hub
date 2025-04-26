import { currentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/type";
import { DirectMessage, Member, Profile } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    if (req.method !== "PATCH" && req.method !== "DELETE") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    const profile = await currentProfilePages(req);
    const { conversationId, serverId, memberId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!conversationId) {
      return res.status(400).json({ error: "Conversation Id Missing" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "Server Id Missing" });
    }
    if (!memberId) {
      return res.status(400).json({ error: "Member Id Missing" });
    }

    let direMessage: DirectMessage & { member: Member & { profile: Profile } };

    if (req.method === "PATCH") {
      direMessage = await db.directMessage.update({
        where: {
          id: memberId as string,
          conversationId: conversationId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    } else if (req.method === "DELETE") {
      direMessage = await db.directMessage.update({
        where: {
          id: memberId as string,
          conversationId: conversationId as string,
        },
        data: {
          content: "This message has been deleted",
          fileUrl: null,
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    } else {
      return res.json({ error: "Message Not Found" });
    }

    const chatId = `chat:${direMessage?.conversationId}:messages:update`;

    res?.socket?.server?.io.emit(chatId, direMessage);

    return res.json(direMessage);
  } catch (error) {
    console.error("[API>SOCKET>DIRECT_MESSAGES]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
