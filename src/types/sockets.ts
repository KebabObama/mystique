import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiResponse } from "next";
import { Server } from "socket.io";

export type SocketServer = HTTPServer & { io?: Server | undefined };
export type SocketWithServer = NetSocket & { server: SocketServer };
export type NextApiResponseWithSocket = NextApiResponse & {
  socket: SocketWithServer;
};
