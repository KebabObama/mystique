import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import * as Lobby from "@/lib/lobby";
import { and, eq } from "drizzle-orm";
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
    const isPosition = (value: unknown): value is Game.Position => {
      if (!value || typeof value !== "object") return false;
      const point = value as Partial<Game.Position>;
      return typeof point.x === "number" && typeof point.z === "number";
    };

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

    const normalizeQuantity = (value: unknown) => {
      if (typeof value !== "number" || !Number.isFinite(value)) return 1;
      return Math.max(1, Math.floor(value));
    };

    const upsertCharacterInventory = async (
      tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
      characterId: string,
      itemId: string,
      quantity: number
    ) => {
      const existing = await tx.query.inventory.findFirst({
        where: and(
          eq(schema.inventory.characterId, characterId),
          eq(schema.inventory.itemId, itemId)
        ),
      });

      if (!existing) {
        await tx.insert(schema.inventory).values({ characterId, itemId, quantity });
        return;
      }

      await tx
        .update(schema.inventory)
        .set({ quantity: existing.quantity + quantity })
        .where(
          and(eq(schema.inventory.characterId, characterId), eq(schema.inventory.itemId, itemId))
        );
    };

    const upsertChestInventory = async (
      tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
      chestId: string,
      itemId: string,
      quantity: number
    ) => {
      const existing = await tx.query.chestInventory.findFirst({
        where: and(
          eq(schema.chestInventory.chestId, chestId),
          eq(schema.chestInventory.itemId, itemId)
        ),
      });

      if (!existing) {
        await tx.insert(schema.chestInventory).values({ chestId, itemId, quantity });
        return;
      }

      await tx
        .update(schema.chestInventory)
        .set({ quantity: existing.quantity + quantity })
        .where(
          and(eq(schema.chestInventory.chestId, chestId), eq(schema.chestInventory.itemId, itemId))
        );
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

    socket.on("game:chest:add", async (userId, lobbyId, position) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.masterId !== userId || inst.data.turn !== -1) return;
      if (!isPosition(position)) return;

      await db.transaction(async (tx) => {
        const [newChest] = await tx.insert(schema.chest).values({ name: "Chest" }).returning();
        await tx
          .insert(schema.lobbyEntity)
          .values({ lobbyId: inst.id, type: "chest", chestId: newChest.id, position, actions: 0 });
      });

      const fresh = await Lobby.getInstance(lobbyId);
      await update(fresh);
    });

    socket.on("game:chest:delete", async (userId, lobbyId, entityId) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.masterId !== userId || inst.data.turn !== -1) return;

      const chestEntity = inst.entities.find(
        (entity) => entity.id === entityId && entity.type === "chest"
      );
      if (!chestEntity) return;

      await db.delete(schema.lobbyEntity).where(eq(schema.lobbyEntity.id, chestEntity.id));
      const fresh = await Lobby.getInstance(lobbyId);
      await update(fresh);
    });

    socket.on("game:chest:move", async (userId, lobbyId, entityId, position) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.masterId !== userId || inst.data.turn !== -1) return;
      if (!isPosition(position)) return;

      const chestEntity = inst.entities.find(
        (entity) => entity.id === entityId && entity.type === "chest"
      );
      if (!chestEntity) return;

      const blockedByWall = inst.data.walls.some(
        (wall) => wall.x === position.x && wall.z === position.z
      );
      if (blockedByWall) return;

      await db
        .update(schema.lobbyEntity)
        .set({ position })
        .where(eq(schema.lobbyEntity.id, chestEntity.id));

      const fresh = await Lobby.getInstance(lobbyId);
      await update(fresh);
    });

    socket.on("game:monster:add", async (userId, lobbyId, monsterId, position) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.masterId !== userId || inst.data.turn !== -1) return;
      if (!isPosition(position)) return;
      if (typeof monsterId !== "string") return;

      const template = await db.query.monster.findFirst({
        where: eq(schema.monster.id, monsterId),
      });
      if (!template) return;

      const fresh = await db.transaction(async (tx) => {
        const [newMonster] = await tx
          .insert(schema.monster)
          .values({
            name: template.name,
            level: template.level,
            hp: template.hp,
            maxHp: template.maxHp,
            armor: template.armor,
            stamina: template.stamina,
            maxActions: template.maxActions,
            memory: template.memory,
            abilities: template.abilities,
          })
          .returning();

        const [entity] = await tx
          .insert(schema.lobbyEntity)
          .values({
            lobbyId: inst.id,
            type: "monster",
            monsterId: newMonster.id,
            position,
            actions: newMonster.maxActions,
          })
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

    socket.on("game:monster:delete", async (userId, lobbyId, entityId) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.masterId !== userId || inst.data.turn !== -1) return;
      if (typeof entityId !== "string") return;

      const monsterEntity = inst.entities.find(
        (entity) => entity.id === entityId && entity.type === "monster"
      );
      if (!monsterEntity) return;

      const sequence = inst.data.sequence.filter((id) => id !== monsterEntity.id);

      const fresh = await db.transaction(async (tx) => {
        await tx.delete(schema.lobbyEntity).where(eq(schema.lobbyEntity.id, monsterEntity.id));
        await tx
          .update(schema.lobby)
          .set({ data: { ...inst.data, sequence } })
          .where(eq(schema.lobby.id, inst.id));

        return await Lobby.getInstance(lobbyId, tx as any);
      });

      if (!fresh) return;
      instances.set(lobbyId, fresh);
      io.to(`game:${inst.id}`).emit("game:state", fresh);
    });

    socket.on("game:inventory:grant", async (userId, lobbyId, targetEntityId, itemId, qty) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.masterId !== userId) return;

      const target = inst.entities.find((entity) => entity.id === targetEntityId);
      if (!target || target.type === "monster") return;

      const item = await db.query.item.findFirst({ where: eq(schema.item.id, itemId) });
      if (!item) return;

      const quantity = normalizeQuantity(qty);

      await db.transaction(async (tx) => {
        if (target.type === "character") {
          await upsertCharacterInventory(tx, target.playable.id, item.id, quantity);
          return;
        }

        await upsertChestInventory(tx, target.playable.id, item.id, quantity);
      });

      const fresh = await Lobby.getInstance(lobbyId);
      await update(fresh);
    });

    socket.on(
      "game:inventory:transfer",
      async (userId, lobbyId, fromEntityId, toEntityId, itemId, qty) => {
        const inst = await exists(userId, lobbyId);
        if (!inst) return;
        if (typeof itemId !== "string") return;
        if (fromEntityId === toEntityId) return;

        const quantity = normalizeQuantity(qty);
        const fromEntity = inst.entities.find((entity) => entity.id === fromEntityId);
        const toEntity = inst.entities.find((entity) => entity.id === toEntityId);
        if (!fromEntity || !toEntity) return;
        if (fromEntity.type === "monster" || toEntity.type === "monster") return;

        const isMaster = inst.masterId === userId;
        if (!isMaster) {
          const userCharacter = (entity: Game.Entity) =>
            entity.type === "character" && entity.playable.ownerId === userId;

          const validPlayerMove =
            (userCharacter(fromEntity) && toEntity.type === "chest") ||
            (fromEntity.type === "chest" && userCharacter(toEntity));

          if (!validPlayerMove) return;
        }

        await db.transaction(async (tx) => {
          if (fromEntity.type === "character") {
            const source = await tx.query.inventory.findFirst({
              where: and(
                eq(schema.inventory.characterId, fromEntity.playable.id),
                eq(schema.inventory.itemId, itemId)
              ),
            });
            if (!source || source.quantity < quantity) return;

            if (source.quantity === quantity) {
              await tx
                .delete(schema.inventory)
                .where(
                  and(
                    eq(schema.inventory.characterId, fromEntity.playable.id),
                    eq(schema.inventory.itemId, itemId)
                  )
                );
            } else {
              await tx
                .update(schema.inventory)
                .set({ quantity: source.quantity - quantity })
                .where(
                  and(
                    eq(schema.inventory.characterId, fromEntity.playable.id),
                    eq(schema.inventory.itemId, itemId)
                  )
                );
            }
          } else {
            const source = await tx.query.chestInventory.findFirst({
              where: and(
                eq(schema.chestInventory.chestId, fromEntity.playable.id),
                eq(schema.chestInventory.itemId, itemId)
              ),
            });
            if (!source || source.quantity < quantity) return;

            if (source.quantity === quantity) {
              await tx
                .delete(schema.chestInventory)
                .where(
                  and(
                    eq(schema.chestInventory.chestId, fromEntity.playable.id),
                    eq(schema.chestInventory.itemId, itemId)
                  )
                );
            } else {
              await tx
                .update(schema.chestInventory)
                .set({ quantity: source.quantity - quantity })
                .where(
                  and(
                    eq(schema.chestInventory.chestId, fromEntity.playable.id),
                    eq(schema.chestInventory.itemId, itemId)
                  )
                );
            }
          }

          if (toEntity.type === "character") {
            await upsertCharacterInventory(tx, toEntity.playable.id, itemId, quantity);
            return;
          }

          await upsertChestInventory(tx, toEntity.playable.id, itemId, quantity);
        });

        const fresh = await Lobby.getInstance(lobbyId);
        await update(fresh);
      }
    );

    socket.on("game:inventory:delete", async (userId, lobbyId, entityId, itemId, qty) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (inst.masterId !== userId) return;
      if (typeof itemId !== "string") return;

      const quantity = normalizeQuantity(qty);
      const entity = inst.entities.find((entry) => entry.id === entityId);
      if (!entity || entity.type === "monster") return;

      await db.transaction(async (tx) => {
        if (entity.type === "character") {
          const source = await tx.query.inventory.findFirst({
            where: and(
              eq(schema.inventory.characterId, entity.playable.id),
              eq(schema.inventory.itemId, itemId)
            ),
          });
          if (!source || source.quantity < quantity) return;

          if (source.quantity === quantity) {
            await tx
              .delete(schema.inventory)
              .where(
                and(
                  eq(schema.inventory.characterId, entity.playable.id),
                  eq(schema.inventory.itemId, itemId)
                )
              );
          } else {
            await tx
              .update(schema.inventory)
              .set({ quantity: source.quantity - quantity })
              .where(
                and(
                  eq(schema.inventory.characterId, entity.playable.id),
                  eq(schema.inventory.itemId, itemId)
                )
              );
          }
        } else {
          const source = await tx.query.chestInventory.findFirst({
            where: and(
              eq(schema.chestInventory.chestId, entity.playable.id),
              eq(schema.chestInventory.itemId, itemId)
            ),
          });
          if (!source || source.quantity < quantity) return;

          if (source.quantity === quantity) {
            await tx
              .delete(schema.chestInventory)
              .where(
                and(
                  eq(schema.chestInventory.chestId, entity.playable.id),
                  eq(schema.chestInventory.itemId, itemId)
                )
              );
          } else {
            await tx
              .update(schema.chestInventory)
              .set({ quantity: source.quantity - quantity })
              .where(
                and(
                  eq(schema.chestInventory.chestId, entity.playable.id),
                  eq(schema.chestInventory.itemId, itemId)
                )
              );
          }
        }
      });

      const fresh = await Lobby.getInstance(lobbyId);
      await update(fresh);
    });

    socket.on("game:inventory:drop", async (userId, lobbyId, entityId, itemId, qty) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (typeof itemId !== "string" || typeof entityId !== "string") return;

      const quantity = normalizeQuantity(qty);
      const entity = inst.entities.find((e) => e.id === entityId);
      if (!entity || entity.type !== "character") return;

      const isOwner = entity.playable.ownerId === userId;
      const isMaster = inst.masterId === userId;
      if (!isOwner && !isMaster) return;

      await db.transaction(async (tx) => {
        const source = await tx.query.inventory.findFirst({
          where: and(
            eq(schema.inventory.characterId, entity.playable.id),
            eq(schema.inventory.itemId, itemId)
          ),
        });
        if (!source || source.quantity < quantity) return;
        const maxDrop = source.equipped ? source.quantity - 1 : source.quantity;
        const safeDrop = Math.min(quantity, maxDrop);
        if (safeDrop <= 0) return;

        if (source.quantity - safeDrop <= 0) {
          await tx
            .delete(schema.inventory)
            .where(
              and(
                eq(schema.inventory.characterId, entity.playable.id),
                eq(schema.inventory.itemId, itemId)
              )
            );
        } else {
          await tx
            .update(schema.inventory)
            .set({ quantity: source.quantity - safeDrop })
            .where(
              and(
                eq(schema.inventory.characterId, entity.playable.id),
                eq(schema.inventory.itemId, itemId)
              )
            );
        }
      });

      const fresh = await Lobby.getInstance(lobbyId);
      await update(fresh);
    });

    socket.on("game:inventory:equip", async (userId, lobbyId, entityId, itemId) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (typeof itemId !== "string" || typeof entityId !== "string") return;

      const entity = inst.entities.find((e) => e.id === entityId);
      if (!entity || entity.type !== "character") return;

      const isOwner = entity.playable.ownerId === userId;
      const isMaster = inst.masterId === userId;
      if (!isOwner && !isMaster) return;

      const entry = await db.query.inventory.findFirst({
        where: and(
          eq(schema.inventory.characterId, entity.playable.id),
          eq(schema.inventory.itemId, itemId)
        ),
        with: { item: true },
      });
      if (!entry) return;
      if (entry.item.type === "misc") return;

      await db
        .update(schema.inventory)
        .set({ equipped: !entry.equipped })
        .where(
          and(
            eq(schema.inventory.characterId, entity.playable.id),
            eq(schema.inventory.itemId, itemId)
          )
        );

      const fresh = await Lobby.getInstance(lobbyId);
      await update(fresh);
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
        if (currentEntity && currentEntity.type !== "chest") {
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
      if (entity.type === "chest") return;
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

    socket.on("game:ability:use", async (userId, lobbyId, abilityName, target) => {
      const inst = await exists(userId, lobbyId);
      if (!inst) return;
      if (typeof abilityName !== "string" || !isPosition(target)) return;
      if (inst.data.turn < 0) return;

      const currentId = inst.data.sequence[inst.data.turn];
      if (!currentId) return;

      const caster = inst.entities.find((entity) => entity.id === currentId);
      if (!caster) return;
      if (caster.type === "chest") return;

      if (caster.type === "character" && caster.playable.ownerId !== userId) return;
      if (caster.type === "monster" && inst.masterId !== userId) return;

      const abilities = Game.getEntityAbilities(caster);
      const ability = abilities.find((entry) => entry.name === abilityName);
      if (!ability) return;

      const currentActions = caster.actions ?? caster.playable.maxActions ?? 0;
      if (currentActions < ability.cost) return;

      const origin = caster.position;
      const distance = Math.abs(origin.x - target.x) + Math.abs(origin.z - target.z);
      if (distance > ability.range) return;

      const selectedTiles: Game.Position[] =
        ability.targeting <= 0
          ? [{ x: target.x, z: target.z }]
          : Array.from({ length: ability.targeting * 2 + 1 }).flatMap((_, dxIndex) => {
              const dx = dxIndex - ability.targeting;
              return Array.from({ length: ability.targeting * 2 + 1 }).flatMap((__, dzIndex) => {
                const dz = dzIndex - ability.targeting;
                if (Math.abs(dx) + Math.abs(dz) > ability.targeting) return [];
                return [{ x: target.x + dx, z: target.z + dz }];
              });
            });

      const victims =
        ability.targeting < 0
          ? inst.entities
              .filter(
                (entity): entity is Extract<Game.Entity, { type: "character" | "monster" }> =>
                  entity.type === "character" || entity.type === "monster"
              )
              .map((entity) => ({
                entity,
                distance:
                  Math.abs(entity.position.x - target.x) + Math.abs(entity.position.z - target.z),
              }))
              .filter((entry) => entry.distance <= Math.abs(ability.targeting))
              .sort((a, b) => a.distance - b.distance)
              .slice(0, Math.abs(ability.targeting))
              .map((entry) => entry.entity)
          : inst.entities
              .filter(
                (entity): entity is Extract<Game.Entity, { type: "character" | "monster" }> =>
                  entity.type === "character" || entity.type === "monster"
              )
              .filter((entity) =>
                selectedTiles.some(
                  (tile) => tile.x === entity.position.x && tile.z === entity.position.z
                )
              );

      if (victims.length === 0) return;

      const rollMin = Math.min(ability.amount[0], ability.amount[1]);
      const rollMax = Math.max(ability.amount[0], ability.amount[1]);

      const deadMonsterDrops: { lobbyEntityId: string; position: Game.Position; name: string }[] =
        [];

      await db.transaction(async (tx) => {
        for (const victim of victims) {
          const rawAmount = Math.floor(Math.random() * (rollMax - rollMin + 1)) + rollMin;
          const adjustedAmount =
            rawAmount > 0 ? Math.max(rawAmount - (victim.playable.armor ?? 0), 0) : rawAmount;

          const currentHp = victim.playable.hp ?? victim.playable.maxHp ?? 0;
          const maxHp = victim.playable.maxHp ?? currentHp;
          const nextHp = Math.max(0, Math.min(maxHp, currentHp - adjustedAmount));

          if (victim.type === "character") {
            await tx
              .update(schema.character)
              .set({ hp: nextHp })
              .where(eq(schema.character.id, victim.playable.id));
          } else {
            await tx
              .update(schema.monster)
              .set({ hp: nextHp })
              .where(eq(schema.monster.id, victim.playable.id));

            if (nextHp <= 0) {
              deadMonsterDrops.push({
                lobbyEntityId: victim.id,
                position: victim.position,
                name: `${victim.playable.name} Loot`,
              });
            }
          }
        }

        for (const drop of deadMonsterDrops) {
          const [newChest] = await tx.insert(schema.chest).values({ name: drop.name }).returning();
          await tx
            .insert(schema.lobbyEntity)
            .values({
              lobbyId: inst.id,
              type: "chest",
              chestId: newChest.id,
              position: drop.position,
              actions: 0,
            });

          await tx.delete(schema.lobbyEntity).where(eq(schema.lobbyEntity.id, drop.lobbyEntityId));
        }

        if (deadMonsterDrops.length > 0) {
          const deadEntityIds = new Set(deadMonsterDrops.map((drop) => drop.lobbyEntityId));
          const sequence = inst.data.sequence.filter((entityId) => !deadEntityIds.has(entityId));

          let turn = inst.data.turn;
          if (turn >= 0) {
            const removedBeforeTurn = inst.data.sequence
              .slice(0, turn)
              .filter((entityId) => deadEntityIds.has(entityId)).length;
            turn -= removedBeforeTurn;

            const currentId = inst.data.sequence[inst.data.turn];
            if (currentId && deadEntityIds.has(currentId)) {
              turn = Math.min(turn, sequence.length - 1);
            }

            if (sequence.length === 0) turn = -1;
            else if (turn < 0) turn = 0;
            else if (turn >= sequence.length) turn = sequence.length - 1;
          }

          await tx
            .update(schema.lobby)
            .set({ data: { ...inst.data, sequence, turn } })
            .where(eq(schema.lobby.id, inst.id));
        }

        await tx
          .update(schema.lobbyEntity)
          .set({ actions: currentActions - ability.cost })
          .where(eq(schema.lobbyEntity.id, caster.id));
      });

      const actorName = caster.playable.name;
      const targetLabel = `(${target.x}, ${target.z})`;
      const victimNames = victims.map((entry) => entry.playable.name).join(", ");
      io.to(`game:${inst.id}`).emit("game:message", {
        message: `${actorName} used ${ability.name} at ${targetLabel} and hit ${victimNames}.`,
        variant: "default",
      });
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
