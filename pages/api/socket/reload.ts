import { currentProfilePages } from "@/lib/currentProfilePages";
import { NextApiResponseServerIO } from "@/type";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    const profile = await currentProfilePages(req);

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("triggered");
    res?.socket?.server?.io?.emit("refresh");
    res.json({ success: true });
  } catch (error) {
    console.error("[API>SOCKET>RELOAD_GET]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
