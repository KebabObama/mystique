import { db, schema } from "@/lib/db";
import { InGameHelpers } from "@/lib/ingame-helpers";
import * as Lobby from "@/lib/lobby";
import { and, eq } from "drizzle-orm";
import { emitFullState, exists, isPosition, refresh, update, type SocketContext } from "./helpers";

/** Registers the game entities socket handlers. */
export const register = (ctx: SocketContext) => {
  const { socket, io } = ctx;

  socket.on("game:join", async (userId, lobbyId) => {
    const inst = await exists(ctx, userId, lobbyId, true);
    if (!inst) return;
    socket.join(`game:${inst.id}`);
    io.to(`game:${inst.id}`).emit("game:join", userId);
    emitFullState(socket, inst);
  });

  socket.on("game:leave", async (userId, lobbyId) => {
    socket.leave(`game:${lobbyId}`);
    io.to(`game:${lobbyId}`).emit("game:leave", userId);

    const roomSize = io.sockets.adapter.rooms.get(`game:${lobbyId}`)?.size ?? 0;
    if (roomSize === 0) {
      ctx.instances.delete(lobbyId);
    }
  });

  socket.on("game:chest:add", async (userId, lobbyId, position) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId || inst.data.turn !== -1) return;
    if (!isPosition(position)) return;

    await db.transaction(async (tx) => {
      const [newChest] = await tx.insert(schema.chest).values({ name: "Chest" }).returning();
      await tx
        .insert(schema.lobbyEntity)
        .values({ lobbyId: inst.id, type: "chest", chestId: newChest.id, position, actions: 0 });
    });

    await refresh(ctx, lobbyId);
  });

  socket.on("game:chest:delete", async (userId, lobbyId, entityId) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId || inst.data.turn !== -1) return;

    const chestEntity = inst.chests.find((entity) => entity.id === entityId);
    if (!chestEntity) return;

    await db.delete(schema.lobbyEntity).where(eq(schema.lobbyEntity.id, chestEntity.id));
    await refresh(ctx, lobbyId);
  });

  socket.on("game:chest:move", async (userId, lobbyId, entityId, position) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId || inst.data.turn !== -1) return;
    if (!isPosition(position)) return;

    const chestEntity = inst.chests.find((entity) => entity.id === entityId);
    if (!chestEntity) return;

    const blockedByWall = inst.data.walls.some(
      (wall) => wall.x === position.x && wall.z === position.z
    );
    if (blockedByWall) return;

    await db
      .update(schema.lobbyEntity)
      .set({ position })
      .where(eq(schema.lobbyEntity.id, chestEntity.id));

    await refresh(ctx, lobbyId);
  });

  socket.on("game:monster:add", async (userId, lobbyId, monsterId, position) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId || inst.data.turn !== -1) return;
    if (!isPosition(position)) return;
    if (typeof monsterId !== "string") return;

    const template = await db.query.monster.findFirst({ where: eq(schema.monster.id, monsterId) });
    if (!template) return;

    const fresh = await db.transaction(async (tx) => {
      const [newMonster] = await tx.insert(schema.monster).values(template).returning();

      const entity = await tx
        .insert(schema.lobbyEntity)
        .values({
          lobbyId: inst.id,
          type: "monster",
          monsterId: newMonster.id,
          position,
          actions: newMonster.maxActions,
        })
        .returning()
        .then((e) => e[0]);

      await tx
        .update(schema.lobby)
        .set({ data: { ...inst.data, sequence: [...inst.data.sequence, entity.id] } })
        .where(eq(schema.lobby.id, inst.id));

      return await Lobby.getInstance(lobbyId, tx as any);
    });

    if (!fresh) return;
    await update(ctx, fresh);
  });

  socket.on("game:monster:delete", async (userId, lobbyId, entityId) => {
    const inst = await exists(ctx, userId, lobbyId);
    const monsterEntity = inst?.monsters.find((entity) => entity.id === entityId);
    const sequence = inst?.data.sequence.filter((id) => id !== monsterEntity?.id);
    if (!inst || inst.masterId !== userId || inst.data.turn !== -1 || !monsterEntity || !sequence)
      return;

    const fresh = await db.transaction(async (tx) => {
      await tx.delete(schema.lobbyEntity).where(eq(schema.lobbyEntity.id, monsterEntity.id));
      await tx
        .update(schema.lobby)
        .set({ data: { ...inst.data, sequence } })
        .where(eq(schema.lobby.id, inst.id));

      return await Lobby.getInstance(lobbyId, tx as any);
    });

    if (!fresh) return;
    await update(ctx, fresh);
  });

  socket.on("game:wall:add", async (userId, lobbyId, position) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId || inst.data.turn !== -1) return;
    if (!isPosition(position)) return;

    const blockedByEntity = InGameHelpers.getEntities(inst).some(
      (entity) => entity.position.x === position.x && entity.position.z === position.z
    );
    if (blockedByEntity) return;

    const alreadyWall = inst.data.walls.some(
      (wall) => wall.x === position.x && wall.z === position.z
    );
    if (alreadyWall) return;

    await update(ctx, { ...inst, data: { ...inst.data, walls: [...inst.data.walls, position] } });
  });

  socket.on("game:wall:delete", async (userId, lobbyId, position) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId || inst.data.turn !== -1) return;
    if (!isPosition(position)) return;

    const walls = inst.data.walls.filter((wall) => wall.x !== position.x || wall.z !== position.z);
    if (walls.length === inst.data.walls.length) return;

    await update(ctx, { ...inst, data: { ...inst.data, walls } });
  });

  socket.on("game:wall:add-area", async (userId, lobbyId, start, end) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId || inst.data.turn !== -1) return;
    if (!isPosition(start) || !isPosition(end)) return;

    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minZ = Math.min(start.z, end.z);
    const maxZ = Math.max(start.z, end.z);

    const newWalls: { x: number; z: number }[] = [];
    for (let x = minX; x <= maxX; x++) {
      for (let z = minZ; z <= maxZ; z++) {
        const blockedByEntity = InGameHelpers.getEntities(inst).some(
          (entity) => entity.position.x === x && entity.position.z === z
        );
        const alreadyWall = inst.data.walls.some((wall) => wall.x === x && wall.z === z);
        if (!blockedByEntity && !alreadyWall) newWalls.push({ x, z });
      }
    }
    if (newWalls.length === 0) return;

    await update(ctx, {
      ...inst,
      data: { ...inst.data, walls: [...inst.data.walls, ...newWalls] },
    });
  });

  socket.on("game:wall:delete-area", async (userId, lobbyId, start, end) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId || inst.data.turn !== -1) return;
    if (!isPosition(start) || !isPosition(end)) return;

    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minZ = Math.min(start.z, end.z);
    const maxZ = Math.max(start.z, end.z);

    const walls = inst.data.walls.filter(
      (wall) => wall.x < minX || wall.x > maxX || wall.z < minZ || wall.z > maxZ
    );
    if (walls.length === inst.data.walls.length) return;

    await update(ctx, { ...inst, data: { ...inst.data, walls } });
  });

  socket.on("game:character:add", async (userId, lobbyId, characterId) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.characters.some((entity) => entity.characterId === characterId)) {
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

      const existing = await tx.query.lobbyEntity.findFirst({
        where: and(
          eq(schema.lobbyEntity.lobbyId, lobbyId),
          eq(schema.lobbyEntity.characterId, characterId),
          eq(schema.lobbyEntity.type, "character")
        ),
      });

      if (existing) {
        socket.emit("error", "Character already exists within this instance.");
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
    await update(ctx, fresh);
  });
};
