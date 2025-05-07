import { channel, channelOnMember, member, server } from "@prisma/client";
import { NextApiResponse } from "next";
import { Socket, Server as NetServer } from "net";
import { Server as SocketIoServer } from "socket.io";

export type ServerSchema = server & {
  channels: (channel & {
    members: channelOnMember[];
  })[];
  members: member[];
};

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer;
    };
  };
};
