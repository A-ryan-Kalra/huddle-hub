import { Channel, ChannelOnMember, Member, Server } from "@prisma/client";

export type ServerSchema = Server & {
  channels: (Channel & {
    members: ChannelOnMember[];
  })[];
  members: Member[];
};
