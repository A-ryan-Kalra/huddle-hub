import { Channel, ChannelOnMember, Member, Server } from "@prisma/client";
import { NextApiResponse } from "next";
import { Socket, Server as NetServer } from "net";
import { Server as SocketIoServer } from "socket.io";

export type ServerSchema = Server & {
  channels: (Channel & {
    members: ChannelOnMember[];
  })[];
  members: Member[];
};

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer;
    };
  };
};
