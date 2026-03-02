import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import * as Lobby from "@/lib/lobby";
import { eq } from "drizzle-orm";
import { type SocketContext, exists, isPosition, update } from "./helpers";

export const register = (ctx: SocketContext) => {
  const { socket, io } = ctx;

  // ── Sequence ──────────────────────────────────────────────────────────

  socket.on("game:sequence:next", async (userId, lobbyId) => {
    const inst = await exists(ctx, userId, lobbyId);
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
      const currentEntity = Game.getEntityById(inst, inst.data.sequence[turn]);
      if (
        currentEntity &&
        (currentEntity.type === "character" || currentEntity.type === "monster")
      ) {
        const maxActions = currentEntity.playable.maxActions ?? 0;
        await db
          .update(schema.lobbyEntity)
          .set({ actions: maxActions })
          .where(eq(schema.lobbyEntity.id, currentEntity.id));
      }
    }

    const fresh = await Lobby.getInstance(lobbyId);
    ctx.instances.set(lobbyId, fresh);
    io.to(`game:${fresh.id}`).emit("game:state", fresh);
  });

  socket.on("game:sequence:move", async (userId, lobbyId, entityId, delta) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId) return;
    if (inst.data.turn !== -1) return;
    const index = inst.data.sequence.findIndex((s) => s === entityId);
    const next = index + delta;
    if (index === -1 || next < 0 || next >= inst.data.sequence.length) return;
    const sequence = [...inst.data.sequence];
    [sequence[index], sequence[next]] = [sequence[next], sequence[index]];
    const fresh = { ...inst, data: { ...inst.data, sequence } } as Game.Instance;
    await update(ctx, fresh);
  });

  // ── Movement ──────────────────────────────────────────────────────────

  socket.on("game:character:move", async (userId, lobbyId, entityId, position) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    const entity = Game.getEntityById(inst, entityId);
    if (!entity) return;
    if (entity.type === "chest" || entity.type === "campfire") return;
    if (entity.type === "character" && entity.playable.ownerId !== userId) return;
    if (entity.type === "monster" && userId !== inst.masterId) return;
    const currentActions = entity.actions ?? entity.playable.maxActions ?? 0;
    if (currentActions <= 0) return;

    const positions = Game.getEntities(inst).map((e) => e.position);
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
    await update(ctx, fresh);
  });

  // ── Abilities ─────────────────────────────────────────────────────────

  socket.on("game:ability:use", async (userId, lobbyId, abilityName, target) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (typeof abilityName !== "string" || !isPosition(target)) return;
    if (inst.data.turn < 0) return;

    const currentId = inst.data.sequence[inst.data.turn];
    if (!currentId) return;

    const caster = Game.getEntityById(inst, currentId);
    if (!caster) return;
    if (caster.type === "chest" || caster.type === "campfire") return;

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

    const victims = Game.getAbilityVictims(Game.getEntities(inst), ability, target);

    if (victims.length === 0) return;

    const rollMin = Math.min(ability.amount[0], ability.amount[1]);
    const rollMax = Math.max(ability.amount[0], ability.amount[1]);

    const deadMonsterDrops: { lobbyEntityId: string; position: Game.Position; name: string }[] = [];

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

          const currentTurnId = inst.data.sequence[inst.data.turn];
          if (currentTurnId && deadEntityIds.has(currentTurnId)) {
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
    await update(ctx, fresh);
  });
};
