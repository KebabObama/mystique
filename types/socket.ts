import type { NextApiResponse } from "next";
import type { Server as HTTPServer } from "node:http";
import type { Socket as NetSocket } from "node:net";
import type { Server } from "socket.io";

export type SocketServer = HTTPServer & { io?: Server | undefined };
export type SocketWithServer = NetSocket & { server: SocketServer };
export type NextApiResponseWithSocket = NextApiResponse & { socket: SocketWithServer };

