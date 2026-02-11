import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import * as Lobby from "@/lib/lobby";
import { eq } from "drizzle-orm";
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
    const exists = async (
      userId: string,
      lobbyId: string,
      check = false
    ): Promise<Game.Instance | null> => {
      let inst = instances.get(lobbyId);
      if (!inst || check) {
        inst = await Lobby.getInstance(lobbyId);
        if (!inst) {
          socket.emit("error", "Lobby does not exist");
          return null;
        }
        instances.set(lobbyId, inst);
      }
      if (!inst) {
        socket.emit("error", "Lobby does not exist");
        return null;
      }
      if (inst.members.every((e) => e.id !== userId)) {
        socket.emit("error", `You are not member of lobby: ${inst.id}`);
        return null;
      }
      return inst;
    };

    const update = async (fresh: Game.Instance, event?: string) => {
      await db.update(schema.lobby).set({ data: fresh.data }).where(eq(schema.lobby.id, fresh.id));
      instances.set(fresh.id, fresh);
      io.to(`game:${fresh.id}`).emit(event ?? "game:state", fresh);
    };

    socket.on("lobby:get", async (userId) => {
      const lobbies = await Lobby.getAll(userId);
      lobbies.forEach((e) => socket.join(`lobby:${e.id}`));
      socket.emit("lobby:get", lobbies);
    });

    socket.on("lobby:create", async (userId, name) => {
      const result = await Lobby.create(userId, name);
      socket.join(`lobby:${result.id}`);
      socket.emit("lobby:create", result);
    });

    socket.on("lobby:leave", async (userId, lobbyId) => {
      await Lobby.leave(userId, lobbyId);
      socket.emit("lobby:leave", lobbyId);
    });

    socket.on("lobby:join", async (userId, lobbyId) => {
      const result = await Lobby.join(userId, lobbyId);
      socket.join(`lobby:${result.id}`);
      io.to(`lobby:${result.id}`).emit("lobby:join", result);
    });

    socket.on("lobby:send", async (userId, lobbyId, content) => {
      const result = await Lobby.send(userId, lobbyId, content);
      io.to(`lobby:${result.lobbyId}`).emit("lobby:send", result);
    });

    socket.on("game:join", async (userId, lobbyId) => {
      const inst = await exists(userId, lobbyId, true);
      if (!inst) return;
      socket.join(`game:${inst.id}`);
      io.to(`game:${inst.id}`).emit("game:join", userId);
      socket.emit("game:state", inst);
    });

    socket.on("game:character:add", async (userId, lobbyId, characterId) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.entities.some((e) => e.type === "character" && e.playable.id === characterId)) {
        socket.emit("error", "Character already exists within this instance.");
        return;
      }
      const fresh = await db.transaction(async (tx) => {
        const [entity] = await tx
          .insert(schema.lobbyEntity)
          .values({ lobbyId, characterId, type: "character" })
          .returning();
        await tx
          .update(schema.lobby)
          .set({ data: { ...inst.data, sequence: [...inst.data.sequence, entity.id] } })
          .where(eq(schema.lobby.id, inst.id));
        return await Lobby.getInstance(lobbyId, tx as any);
      });
      instances.set(lobbyId, fresh);
      io.to(`game:${inst.id}`).emit("game:state", fresh);
    });

    socket.on("game:leave", async (userId, lobbyId) => {
      socket.leave(`game:${lobbyId}`);
      io.to(`game:${lobbyId}`).emit("game:leave", userId);
    });

    socket.on("game:sequence:next", async (userId, lobbyId) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      let turn = inst.data.turn;
      if (turn === -1) {
        if (userId !== inst.masterId) return;
        turn = 0;
      } else {
        const next = turn + 1;
        turn = next >= inst.data.sequence.length ? -1 : next;
      }
      const freshData: Game.Data = { ...inst.data, turn };
      await db.update(schema.lobby).set({ data: freshData }).where(eq(schema.lobby.id, lobbyId));
      instances.set(lobbyId, { ...inst, data: freshData });
      io.to(`game:${lobbyId}`).emit("game:sequence:next", turn);
    });

    socket.on("game:sequence:move", async (userId, lobbyId, entityId, delta) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.masterId !== userId) return;
      if (inst.data.turn !== -1) return;
      const index = inst.data.sequence.findIndex((s) => s === entityId);
      const next = index + delta;
      if (index === -1 || next < 0 || next >= inst.data.sequence.length) return;
      const sequence = [...inst.data.sequence];
      [sequence[index], sequence[next]] = [sequence[next], sequence[index]];
      const fresh = { ...inst, data: { ...inst.data, sequence } } as Game.Instance;
      await update(fresh);
    });

    socket.on("disconnect", () => {
      for (const room of socket.rooms) {
        if (!room.startsWith("game:")) continue;
        const lobbyId = room.replace("game:", "");
        const inst = instances.get(lobbyId);
        if (!inst) continue;
        socket.to(room).emit("game:leave");
        const roomSize = io.sockets.adapter.rooms.get(room)?.size ?? 0;
        if (roomSize === 0) instances.delete(lobbyId);
      }
    });
  });

  res.end();
};
