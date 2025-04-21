import { channel } from "diagnostics_channel";
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

    if (!content) {
      return res.status(400).json({ error: "Content is Missing" });
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
        content: content as string,
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

    const channelKey = `chat:${channel.id}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(201).json(message);
  } catch (error) {
    console.error("[SOCKET>API>MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
