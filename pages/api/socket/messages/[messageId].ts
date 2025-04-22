import { currentProfilePages } from "@/lib/currentProfilePages";
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
    console.log("messageId check", messageId);

    if (!profile) {
      return;
    }
  } catch (error) {
    console.error("[API_SOCKET_MESSAGES_ID_PATCH]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
