import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import { InGameHelpers } from "@/lib/ingame-helpers";
import { and, eq } from "drizzle-orm";
import {
  type SocketContext,
  exists,
  normalizeQuantity,
  refresh,
  upsertCharacterInventory,
  upsertChestInventory,
} from "./helpers";

type DbTx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const takeCharacterInventory = async (
  tx: DbTx,
  characterId: string,
  itemId: string,
  quantity: number,
  options?: { allowPartial?: boolean; preserveEquippedOne?: boolean }
) => {
  const source = await tx.query.inventory.findFirst({
    where: and(eq(schema.inventory.characterId, characterId), eq(schema.inventory.itemId, itemId)),
  });
  if (!source) return 0;

  const minRemaining = options?.preserveEquippedOne && source.equipped ? 1 : 0;
  const maxTake = Math.max(0, source.quantity - minRemaining);
  const taken = options?.allowPartial ? Math.min(quantity, maxTake) : quantity;

  if (maxTake <= 0 || (!options?.allowPartial && maxTake < quantity)) return 0;

  if (source.quantity - taken <= 0) {
    await tx
      .delete(schema.inventory)
      .where(
        and(eq(schema.inventory.characterId, characterId), eq(schema.inventory.itemId, itemId))
      );
  } else {
    await tx
      .update(schema.inventory)
      .set({ quantity: source.quantity - taken })
      .where(
        and(eq(schema.inventory.characterId, characterId), eq(schema.inventory.itemId, itemId))
      );
  }

  return taken;
};

const takeChestInventory = async (
  tx: DbTx,
  chestId: string,
  itemId: string,
  quantity: number,
  options?: { allowPartial?: boolean }
) => {
  const source = await tx.query.chestInventory.findFirst({
    where: and(
      eq(schema.chestInventory.chestId, chestId),
      eq(schema.chestInventory.itemId, itemId)
    ),
  });
  if (!source) return 0;

  if (!options?.allowPartial && source.quantity < quantity) return 0;

  const taken = options?.allowPartial ? Math.min(quantity, source.quantity) : quantity;

  if (source.quantity - taken <= 0) {
    await tx
      .delete(schema.chestInventory)
      .where(
        and(eq(schema.chestInventory.chestId, chestId), eq(schema.chestInventory.itemId, itemId))
      );
  } else {
    await tx
      .update(schema.chestInventory)
      .set({ quantity: source.quantity - taken })
      .where(
        and(eq(schema.chestInventory.chestId, chestId), eq(schema.chestInventory.itemId, itemId))
      );
  }

  return taken;
};

/** Registers the inventory socket handlers. */
export const register = (ctx: SocketContext) => {
  const { socket } = ctx;

  socket.on("game:inventory:grant", async (userId, lobbyId, targetEntityId, itemId, qty) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId) return;

    const target = InGameHelpers.getEntityById(inst, targetEntityId);
    if (!target || target.type === "monster" || target.type === "campfire") return;

    const item = await db.query.item.findFirst({
      where: eq(schema.item.id, itemId),
      columns: { id: true },
    });
    if (!item) return;

    const quantity = normalizeQuantity(qty);

    await db.transaction(async (tx) => {
      if (target.type === "character") {
        await upsertCharacterInventory(tx, target.characterId, item.id, quantity);
      } else {
        await upsertChestInventory(tx, target.chestId, item.id, quantity);
      }
    });

    await refresh(ctx, lobbyId);
  });

  socket.on(
    "game:inventory:transfer",
    async (userId, lobbyId, fromEntityId, toEntityId, itemId, qty) => {
      const inst = await exists(ctx, userId, lobbyId);
      if (!inst) return;
      if (typeof itemId !== "string") return;
      if (fromEntityId === toEntityId) return;

      const quantity = normalizeQuantity(qty);
      const fromEntity = InGameHelpers.getEntityById(inst, fromEntityId);
      const toEntity = InGameHelpers.getEntityById(inst, toEntityId);
      if (!fromEntity || !toEntity) return;
      if (
        fromEntity.type === "monster" ||
        fromEntity.type === "campfire" ||
        toEntity.type === "monster" ||
        toEntity.type === "campfire"
      )
        return;

      const isMaster = inst.masterId === userId;
      if (!isMaster) {
        const userCharacter = (entity: Game.Entity) =>
          entity.type === "character" && entity.ownerId === userId;

        const validPlayerMove =
          (userCharacter(fromEntity) && toEntity.type === "chest") ||
          (fromEntity.type === "chest" && userCharacter(toEntity));

        if (!validPlayerMove) return;
      }

      const moved = await db.transaction(async (tx) => {
        const taken =
          fromEntity.type === "character"
            ? await takeCharacterInventory(tx, fromEntity.characterId, itemId, quantity)
            : await takeChestInventory(tx, fromEntity.chestId, itemId, quantity);

        if (taken <= 0) return 0;

        if (toEntity.type === "character") {
          await upsertCharacterInventory(tx, toEntity.characterId, itemId, taken);
          return taken;
        }

        await upsertChestInventory(tx, toEntity.chestId, itemId, taken);
        return taken;
      });

      if (moved <= 0) return;
      await refresh(ctx, lobbyId);
    }
  );

  socket.on("game:inventory:delete", async (userId, lobbyId, entityId, itemId, qty) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId) return;
    if (typeof itemId !== "string") return;

    const quantity = normalizeQuantity(qty);
    const entity = InGameHelpers.getEntityById(inst, entityId);
    if (!entity || entity.type === "monster" || entity.type === "campfire") return;

    const changed = await db.transaction(async (tx) => {
      const taken =
        entity.type === "character"
          ? await takeCharacterInventory(tx, entity.characterId, itemId, quantity)
          : await takeChestInventory(tx, entity.chestId, itemId, quantity);

      return taken > 0;
    });

    if (!changed) return;
    await refresh(ctx, lobbyId);
  });

  socket.on("game:inventory:drop", async (userId, lobbyId, entityId, itemId, qty) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (typeof itemId !== "string" || typeof entityId !== "string") return;

    const quantity = normalizeQuantity(qty);
    const entity = inst.characters.find((entry) => entry.id === entityId);
    if (!entity || entity.type !== "character") return;

    const isOwner = entity.ownerId === userId;
    const isMaster = inst.masterId === userId;
    if (!isOwner && !isMaster) return;

    const dropped = await db.transaction(async (tx) => {
      return takeCharacterInventory(tx, entity.characterId, itemId, quantity, {
        allowPartial: true,
        preserveEquippedOne: true,
      });
    });

    if (dropped <= 0) return;
    await refresh(ctx, lobbyId);
  });

  socket.on("game:inventory:equip", async (userId, lobbyId, entityId, itemId) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (typeof itemId !== "string" || typeof entityId !== "string") return;

    const entity = inst.characters.find((entry) => entry.id === entityId);
    if (!entity || entity.type !== "character") return;

    const isOwner = entity.ownerId === userId;
    const isMaster = inst.masterId === userId;
    if (!isOwner && !isMaster) return;

    const entry = await db.query.inventory.findFirst({
      where: and(
        eq(schema.inventory.characterId, entity.characterId),
        eq(schema.inventory.itemId, itemId)
      ),
      with: { item: true },
    });
    if (!entry) return;
    if (entry.item.type === "misc") return;

    if (!entry.equipped) {
      const equippedItems = await db.query.inventory.findMany({
        where: and(
          eq(schema.inventory.characterId, entity.characterId),
          eq(schema.inventory.equipped, true)
        ),
        columns: {},
        with: { item: { columns: { type: true } } },
      });

      const maxSlots = entry.item.type === "ring" ? 2 : 1;
      let equippedOfType = 0;
      for (const equippedItem of equippedItems) {
        if (equippedItem.item.type === entry.item.type) equippedOfType += 1;
        if (equippedOfType >= maxSlots) return;
      }
    }

    await db
      .update(schema.inventory)
      .set({ equipped: !entry.equipped })
      .where(
        and(
          eq(schema.inventory.characterId, entity.characterId),
          eq(schema.inventory.itemId, itemId)
        )
      );

    await refresh(ctx, lobbyId);
  });
};
