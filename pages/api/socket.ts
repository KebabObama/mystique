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
        const character = await tx.query.character.findFirst({
          where: eq(schema.character.id, characterId),
        });
        if (!character) {
          socket.emit("error", "Character not found");
          return;
        }
        const [entity] = await tx
          .insert(schema.lobbyEntity)
          .values({ lobbyId, characterId, type: "character", actions: character.maxActions })
          .returning();
        await tx
          .update(schema.lobby)
          .set({ data: { ...inst.data, sequence: [...inst.data.sequence, entity.id] } })
          .where(eq(schema.lobby.id, inst.id));
        return await Lobby.getInstance(lobbyId, tx as any);
      });
      if (!fresh) return;
      instances.set(lobbyId, fresh);
      io.to(`game:${inst.id}`).emit("game:state", fresh);
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

      await db
        .update(schema.lobby)
        .set({ data: { ...inst.data, turn } })
        .where(eq(schema.lobby.id, inst.id));

      if (turn >= 0) {
        const currentEntity = inst.entities.find((e) => e.id === inst.data.sequence[turn]);
        if (currentEntity) {
          const maxActions = currentEntity.playable.maxActions ?? 0;
          await db
            .update(schema.lobbyEntity)
            .set({ actions: maxActions })
            .where(eq(schema.lobbyEntity.id, currentEntity.id));
        }
      }

      const fresh = await Lobby.getInstance(lobbyId);
      instances.set(lobbyId, fresh);
      io.to(`game:${fresh.id}`).emit("game:state", fresh);
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

    socket.on("game:character:move", async (userId, lobbyId, entityId, position) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      const entity = inst.entities.find((e) => e.id === entityId);
      if (!entity) return;
      if (entity.type === "character" && entity.playable.ownerId !== userId) return;
      if (entity.type === "monster" && userId !== inst.masterId) return;
      const currentActions = entity.actions ?? entity.playable.maxActions ?? 0;
      if (currentActions <= 0) return;

      const positions = inst.entities.map((e) => e.position);
      const { stamina } = entity.playable;
      const possible: Game.Position[] = [];
      for (let dx = -stamina; dx <= stamina; dx++) {
        for (let dz = -stamina; dz <= stamina; dz++) {
          if (Math.abs(dx) + Math.abs(dz) > stamina) continue;
          const targetX = entity.position.x + dx;
          const targetZ = entity.position.z + dz;
          const isWall = inst.data.walls.some(({ x, z }) => x === targetX && z === targetZ);
          const isOccupied = positions.some((pos) => pos.x === targetX && pos.z === targetZ);
          if (!isWall && !isOccupied) possible.push({ x: targetX, z: targetZ });
        }
      }
      if (!possible.some((p) => p.x === position.x && p.z === position.z)) return;

      const newActions = currentActions - 1;
      await db
        .update(schema.lobbyEntity)
        .set({ position, actions: newActions })
        .where(eq(schema.lobbyEntity.id, entityId));
      const fresh = await Lobby.getInstance(lobbyId);
      await update(fresh);
    });

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
