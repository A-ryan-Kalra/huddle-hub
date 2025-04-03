import { Channel, ChannelOnMember, Member, Server } from "@prisma/client";

export type ServerSchema = Server & {
  channels: (ChannelOnMember & {
    memberId: string;
    channelId: string;
    serverId: string;
  })[];
  members: Member[];
};
