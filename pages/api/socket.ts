import { Game } from "@/lib/game";
import { register as registerCampfire } from "@/lib/socket/campfire";
import { register as registerGameActions } from "@/lib/socket/game-actions";
import { register as registerGameEntities } from "@/lib/socket/game-entities";
import { type SocketContext } from "@/lib/socket/helpers";
import { register as registerInventory } from "@/lib/socket/inventory";
import { register as registerLeveling } from "@/lib/socket/leveling";
import { register as registerLobby } from "@/lib/socket/lobby";
import { register as registerTrading } from "@/lib/socket/trading";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "node:http";
import type { Socket as NetSocket } from "node:net";
import { Server } from "socket.io";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & { server: HTTPServer & { io?: Server } };
};

const instances = new Map<string, Game.Instance>();
const SOCKET_DEBUG = process.env.SOCKET_DEBUG === "1";

const formatArg = (value: unknown) => {
  if (typeof value === "string") return value.length > 120 ? `${value.slice(0, 117)}...` : value;
  if (typeof value === "number" || typeof value === "boolean" || value == null) return value;

  try {
    const text = JSON.stringify(value);
    return text.length > 240 ? `${text.slice(0, 237)}...` : text;
  } catch {
    return "[unserializable]";
  }
};

const debug = (...parts: unknown[]) => {
  if (!SOCKET_DEBUG) return;
  const time = new Date().toISOString();
  console.log(`[socket][${time}]`, ...parts);
};

export default (_req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;
  io.on("connection", (socket) => {
    const ctx: SocketContext = { socket, io, instances };

    debug("connected", { socketId: socket.id });

    socket.onAny((event, ...args) => {
      debug("in", event, args.map(formatArg));
    });

    const originalEmit = socket.emit.bind(socket);
    socket.emit = ((event: string, ...args: unknown[]) => {
      debug("out", event, args.map(formatArg));
      return originalEmit(event, ...args);
    }) as typeof socket.emit;

    socket.on("error", (error) => {
      debug("error", {
        socketId: socket.id,
        error: error instanceof Error ? error.message : error,
      });
    });

    registerLobby(ctx);
    registerGameEntities(ctx);
    registerInventory(ctx);
    registerGameActions(ctx);
    registerTrading(ctx);
    registerCampfire(ctx);
    registerLeveling(ctx);

    socket.on("disconnect", () => {
      debug("disconnected", { socketId: socket.id, rooms: [...socket.rooms] });
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
