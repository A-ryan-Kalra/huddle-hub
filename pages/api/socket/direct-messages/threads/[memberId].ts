import { currentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/type";
import { directMessage, member, profile, threads } from "@prisma/client";
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
    const { messageId, serverId, memberId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!messageId) {
      return res.status(400).json({ error: "Message Id Missing" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "Server Id Missing" });
    }
    if (!memberId) {
      return res.status(400).json({ error: "Thread Id Missing" });
    }

    let direMessage: threads & { member: member & { profile: profile } };

    if (req.method === "PATCH") {
      direMessage = await db.threads.update({
        where: {
          id: memberId as string,
          directMessageId: messageId as string,
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
      direMessage = await db.threads.update({
        where: {
          id: memberId as string,
          directMessageId: messageId as string,
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

    const chatId = `chat:${direMessage?.directMessageId}:messages:update`;

    res?.socket?.server?.io.emit(chatId, direMessage);

    return res.json(direMessage);
  } catch (error) {
    console.error("[API>SOCKET>DIRECT_MESSAGES]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
