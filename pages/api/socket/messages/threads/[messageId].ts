import { currentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/type";
import { memberRole } from "@prisma/client";
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
    const { serverId, messageId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server Id Missing" });
    }

    if (!messageId) {
      return res.status(400).json({ error: "Message Id Missing" });
    }

    const existingMessage = await db.threads.findUnique({
      where: {
        id: messageId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!existingMessage || existingMessage?.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }
    const currentMember = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId: serverId as string,
      },
      include: {
        profile: true,
      },
    });

    const isAdmin = currentMember?.role === memberRole.ADMIN;
    const isModerator = isAdmin || currentMember?.role === memberRole.MODERATOR;
    const isOwner = currentMember?.profileId === profile.id;

    const canModify = isAdmin || isModerator || isOwner;
    let message;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized to make changes" });
    }
    if (req.method === "DELETE") {
      message = await db.threads.update({
        where: {
          id: existingMessage?.id as string,
        },
        data: {
          deleted: true,
          fileUrl: null,
          content: "This message has been deleted",
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isOwner) {
        return res.status(401).json({ error: "Unauthorized to make changes" });
      }
      message = await db.threads.update({
        where: {
          id: existingMessage?.id as string,
          memberId: currentMember?.id,
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
    }

    const updateKey = `chat:${message?.messageId}:messages:update`;
    res?.socket?.server?.io.emit(updateKey, message);

    return res.json(message);
  } catch (error) {
    console.error("[API_SOCKET_MESSAGES_ID_PATCH]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
