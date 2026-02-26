import { Game } from "@/lib/game";
import { register as registerGameActions } from "@/lib/socket/game-actions";
import { register as registerGameEntities } from "@/lib/socket/game-entities";
import { type SocketContext } from "@/lib/socket/helpers";
import { register as registerInventory } from "@/lib/socket/inventory";
import { register as registerLobby } from "@/lib/socket/lobby";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "node:http";
import type { Socket as NetSocket } from "node:net";
import { Server } from "socket.io";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & { server: HTTPServer & { io?: Server } };
};

const instances = new Map<string, Game.Instance>();

export default (_req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;
  io.on("connection", (socket) => {
    const ctx: SocketContext = { socket, io, instances };

    registerLobby(ctx);
    registerGameEntities(ctx);
    registerInventory(ctx);
    registerGameActions(ctx);

    socket.on("disconnect", (userId) => {
      for (const room of socket.rooms) {
        if (!room.startsWith("game:")) continue;
        const lobbyId = room.replace("game:", "");
        const inst = instances.get(lobbyId);
        if (!inst) continue;
        if (inst.members.every((i) => i.id !== userId)) continue;
        const roomSize = io.sockets.adapter.rooms.get(room)?.size ?? 0;
        if (roomSize === 0) instances.delete(lobbyId);
        console.log(roomSize);
      }
    });
  });

  res.end();
};
