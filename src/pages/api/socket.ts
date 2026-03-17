import { Game } from "@/lib/game";
import { register as registerCampfire } from "@/socket/campfire";
import { register as registerGameActions } from "@/socket/game-actions";
import { register as registerGameEntities } from "@/socket/game-entities";
import { type SocketContext } from "@/socket/helpers";
import { register as registerInventory } from "@/socket/inventory";
import { register as registerLeveling } from "@/socket/leveling";
import { register as registerLobby } from "@/socket/lobby";
import { register as registerTrading } from "@/socket/trading";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "node:http";
import type { Socket as NetSocket } from "node:net";
import { Server } from "socket.io";

/** Represents the next api response with socket type. */
export type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & { server: HTTPServer & { io?: Server } };
};

const instances = new Map<string, Game.Instance>();

/** Handles Socket.IO API requests. */
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
    registerTrading(ctx);
    registerCampfire(ctx);
    registerLeveling(ctx);

    socket.on("disconnect", () => {
      for (const room of socket.rooms) {
        if (!room.startsWith("game:")) continue;
        const lobbyId = room.replace("game:", "");
        socket.leave(room);
        io.to(room).emit("game:leave", socket.id);
        const roomSize = io.sockets.adapter.rooms.get(room)?.size ?? 0;
        if (roomSize === 0) {
          instances.delete(lobbyId);
        }
      }
    });
  });

  res.end();
};
