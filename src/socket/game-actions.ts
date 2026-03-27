import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import { InGameHelpers } from "@/lib/ingame-helpers";
import { eq } from "drizzle-orm";
import { type SocketContext, exists, isPosition, refresh, update } from "./helpers";

/** Registers the game actions socket handlers. */
export const register = (ctx: SocketContext) => {
  const { socket, io } = ctx;

  socket.on("game:sequence:next", async (userId, lobbyId) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;

    const previousTurn = inst.data.turn;
    const previousEntity =
      previousTurn >= 0
        ? InGameHelpers.getEntityById(inst, inst.data.sequence[previousTurn])
        : undefined;

    let sequence = [...inst.data.sequence];
    let turn = inst.data.turn;
    if (turn === -1) {
      if (userId !== inst.masterId) return;
      turn = 0;
    } else {
      const next = turn + 1;
      turn = next >= inst.data.sequence.length ? -1 : next;
    }

    await db.transaction(async (tx) => {
      if (
        previousEntity &&
        (previousEntity.type === "character" || previousEntity.type === "monster")
      ) {
        await tx
          .update(schema.lobbyEntity)
          .set({ activeEffects: Game.EMPTY_EFFECTS })
          .where(eq(schema.lobbyEntity.id, previousEntity.id));
      }

      while (turn >= 0) {
        const currentId = sequence[turn];
        const currentEntity = currentId ? InGameHelpers.getEntityById(inst, currentId) : undefined;

        if (
          !currentEntity ||
          (currentEntity.type !== "character" && currentEntity.type !== "monster")
        ) {
          turn = -1;
          break;
        }

        const resolved = InGameHelpers.resolveTurnStart(currentEntity);

        if (currentEntity.type === "character") {
          await tx
            .update(schema.character)
            .set({ hp: resolved.hp })
            .where(eq(schema.character.id, currentEntity.characterId));

          await tx
            .update(schema.lobbyEntity)
            .set(resolved)
            .where(eq(schema.lobbyEntity.id, currentEntity.id));

          break;
        }

        await tx
          .update(schema.monster)
          .set({ hp: resolved.hp })
          .where(eq(schema.monster.id, currentEntity.monsterId));

        if (resolved.hp > 0) {
          await tx
            .update(schema.lobbyEntity)
            .set({
              actions: resolved.actions,
              effects: resolved.effects,
              activeEffects: resolved.activeEffects,
            })
            .where(eq(schema.lobbyEntity.id, currentEntity.id));

          break;
        }

        const [newChest] = await tx
          .insert(schema.chest)
          .values({ name: `${currentEntity.name} Loot` })
          .returning();

        await tx
          .insert(schema.lobbyEntity)
          .values({
            lobbyId: inst.id,
            type: "chest",
            chestId: newChest.id,
            position: currentEntity.position,
            actions: 0,
          });

        await tx.delete(schema.lobbyEntity).where(eq(schema.lobbyEntity.id, currentEntity.id));

        sequence = sequence.filter((entityId) => entityId !== currentEntity.id);

        if (sequence.length === 0 || turn >= sequence.length) {
          turn = -1;
          break;
        }
      }

      await tx
        .update(schema.lobby)
        .set({ data: { ...inst.data, sequence, turn } })
        .where(eq(schema.lobby.id, inst.id));
    });

    await refresh(ctx, lobbyId);
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

  socket.on("game:character:move", async (userId, lobbyId, entityId, position) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    const entity = InGameHelpers.getEntityById(inst, entityId);
    if (!entity) return;
    if (entity.type === "chest" || entity.type === "campfire") return;
    if (entity.type === "character" && entity.ownerId !== userId) return;
    if (entity.type === "monster" && userId !== inst.masterId) return;
    const currentActions = entity.actions ?? entity.maxActions ?? 0;
    if (currentActions <= 0) return;

    const positions = InGameHelpers.getEntities(inst).map((e) => e.position);
    const stamina = InGameHelpers.getEffectiveStamina(entity);
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
    await refresh(ctx, lobbyId);
  });

  socket.on("game:ability:use", async (userId, lobbyId, abilityName, target) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (typeof abilityName !== "string" || !isPosition(target)) return;
    if (inst.data.turn < 0) return;

    const currentId = inst.data.sequence[inst.data.turn];
    if (!currentId) return;

    const caster = InGameHelpers.getEntityById(inst, currentId);
    if (!caster) return;
    if (caster.type === "chest" || caster.type === "campfire") return;

    if (caster.type === "character" && caster.ownerId !== userId) return;
    if (caster.type === "monster" && inst.masterId !== userId) return;

    const abilities = InGameHelpers.getEntityAbilities(caster);
    const ability = abilities.find((entry) => entry.name === abilityName);
    if (!ability) return;

    const currentActions = caster.actions ?? caster.maxActions ?? 0;
    if (currentActions < ability.cost) return;

    const origin = caster.position;
    const distance = Math.abs(origin.x - target.x) + Math.abs(origin.z - target.z);
    if (distance > ability.range) return;

    const victims = InGameHelpers.getAbilityVictims(
      InGameHelpers.getEntities(inst),
      ability,
      target
    );

    if (victims.length === 0) return;

    const rollMin = Math.min(ability.amount[0], ability.amount[1]);
    const rollMax = Math.max(ability.amount[0], ability.amount[1]);

    const deadMonsterDrops: { lobbyEntityId: string; position: Game.Position; name: string }[] = [];

    await db.transaction(async (tx) => {
      for (const victim of victims) {
        const rawAmount = Math.floor(Math.random() * (rollMax - rollMin + 1)) + rollMin;
        const adjustedAmount =
          rawAmount > 0
            ? Math.max(rawAmount - InGameHelpers.getEffectiveArmor(victim), 0)
            : rawAmount;

        const currentHp = victim.hp ?? victim.maxHp ?? 0;
        const maxHp = victim.maxHp ?? currentHp;
        const nextHp = Math.max(0, Math.min(maxHp, currentHp - adjustedAmount));
        const nextEffects = InGameHelpers.addEffectStacks(victim.effects, ability.effects);

        if (victim.type === "character") {
          await tx
            .update(schema.character)
            .set({ hp: nextHp })
            .where(eq(schema.character.id, victim.characterId));

          await tx
            .update(schema.lobbyEntity)
            .set({ effects: nextEffects })
            .where(eq(schema.lobbyEntity.id, victim.id));
        } else {
          await tx
            .update(schema.monster)
            .set({ hp: nextHp })
            .where(eq(schema.monster.id, victim.monsterId));

          if (nextHp <= 0) {
            deadMonsterDrops.push({
              lobbyEntityId: victim.id,
              position: victim.position,
              name: `${victim.name} Loot`,
            });
          } else {
            await tx
              .update(schema.lobbyEntity)
              .set({ effects: nextEffects })
              .where(eq(schema.lobbyEntity.id, victim.id));
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

    const actorName = caster.name;
    const targetLabel = `(${target.x}, ${target.z})`;
    const victimNames = victims.map((entry) => entry.name).join(", ");
    io.to(`game:${inst.id}`).emit("game:message", {
      message: `${actorName} used ${ability.name} at ${targetLabel} and hit ${victimNames}.`,
      variant: "default",
    });
    await refresh(ctx, lobbyId);
  });
};
