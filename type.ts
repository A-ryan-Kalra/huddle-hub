import { Channel, Member, Server } from "@prisma/client";

export type ServerSchema = Server & {
  channels: (Channel & {
    members: Member[];
  })[];
  members: Member[];
};
