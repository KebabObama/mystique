import { db, schema } from "@/lib/db";
import * as Lobby from "@/lib/lobby";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "node:http";
import type { Socket as NetSocket } from "node:net";
import { Server } from "socket.io";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & { server: HTTPServer & { io?: Server } };
};

export type Instance = typeof schema.lobby.$inferSelect & {
  members: (typeof schema.user.$inferSelect)[];
  characters: (typeof schema.character.$inferSelect)[];
};

const instances = new Map<string, Instance>();

export default (_req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    const exists = async (userId: string, lobbyId: string): Promise<Instance | null> => {
      let inst = instances.get(lobbyId);
      if (!inst) {
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

    const update = async (fresh: Instance, event?: string) => {
      await db.update(schema.lobby).set(fresh).where(eq(schema.lobby.id, fresh.id));
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
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      socket.join(`game:${inst.id}`);
      io.to(`game:${inst.id}`).emit("game:join", userId);
      socket.emit("game:state", inst);
    });

    socket.on("game:character:add", async (userId, lobbyId, characterId) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.characters.some((e) => e.id === characterId)) {
        socket.emit("error", "Character already exists within this instance.");
        return;
      }
      const fresh = await db.transaction(async (tx) => {
        await tx.insert(schema.lobbyCharacter).values({ lobbyId, characterId });
        await tx
          .update(schema.lobby)
          .set({ sequence: [...inst.sequence, characterId] })
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

    socket.on("game:sequence:next", async (userId, lobbyId, characterId) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.turn === -1) {
        if (userId !== inst.masterId) return;
        const fresh = { ...inst, turn: 0 };
        instances.set(lobbyId, fresh);
        io.to(`game:${lobbyId}`).emit("game:sequence:next", fresh.turn);
        return;
      }
      const activeCharacterId = inst.sequence[inst.turn];
      if (activeCharacterId !== characterId) return;
      const nextTurn = inst.turn + 1;
      const turn = nextTurn >= inst.sequence.length ? -1 : nextTurn;
      const fresh = { ...inst, turn };
      await db.update(schema.lobby).set(fresh).where(eq(schema.lobby.id, fresh.id));
      instances.set(fresh.id, fresh);
      io.to(`game:${fresh.id}`).emit("game:sequence:next", fresh.turn);
    });

    socket.on("game:sequence:move", async (userId, lobbyId, characterId, delta) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.masterId !== userId) return;
      if (inst.turn !== -1) return;
      const index = inst.sequence.indexOf(characterId);
      const next = index + delta;
      if (next < 0 || next >= inst.sequence.length) return;
      const sequence = [...inst.sequence];
      [sequence[index], sequence[next]] = [sequence[next], sequence[index]];
      update({ ...inst, sequence });
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
