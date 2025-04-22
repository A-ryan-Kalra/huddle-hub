import { currentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/type";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    const profile = await currentProfilePages(req);
    const { channelId, serverId, messageId } = req.query;
    const { content } = req.body;
    console.log("messageId check", messageId);

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "Channel Id Missing" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server Id Missing" });
    }

    if (!messageId) {
      return res.status(400).json({ error: "Message Id Missing" });
    }
    if (!content) {
      return res.status(400).json({ error: "Content is Missing" });
    }

    const message = await db.message.update({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      data: {
        content,
      },
      include: {
        member: {
          include: { profile: true },
        },
      },
    });

    const updateKey = `chat:${message.channelId}:messages:update`;
    res?.socket?.server?.io.emit(updateKey, message);

    return res.json(message);
  } catch (error) {
    console.error("[API_SOCKET_MESSAGES_ID_PATCH]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
