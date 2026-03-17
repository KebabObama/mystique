import { db, schema } from "@/lib/db";
import { InGameHelpers } from "@/lib/ingame-helpers";
import { and, eq } from "drizzle-orm";
import {
  type SocketContext,
  exists,
  isPosition,
  normalizeQuantity,
  refresh,
  upsertCharacterInventory,
} from "./helpers";

/** Registers the campfire socket handlers. */
export const register = (ctx: SocketContext) => {
  const { socket, io } = ctx;

socket.on("game:campfire:add", async (userId, lobbyId, position) => {
    try {
      const inst = await exists(ctx, userId, lobbyId);
      if (!inst) return;
      if (inst.masterId !== userId) return;
      if (inst.data.turn !== -1) return;
      if (!isPosition(position)) return;

      await db.transaction(async (tx) => {
        const [newCampfire] = await tx
          .insert(schema.campfire)
          .values({ name: "Campfire" })
          .returning();

        const allItems = await tx.query.item.findMany();
        if (allItems.length > 0) {
          await tx
            .insert(schema.campfireShopItem)
            .values(
              allItems.map((shopItem) => ({
                campfireId: newCampfire.id,
                itemId: shopItem.id,
                cost: Math.max(0, shopItem.value),
              }))
            );
        }

        await tx
          .insert(schema.lobbyEntity)
          .values({
            lobbyId: inst.id,
            type: "campfire",
            campfireId: newCampfire.id,
            position,
            actions: 0,
          });
      });

      await refresh(ctx, lobbyId);
    } catch {
      return;
    }
  });

  socket.on("game:campfire:delete", async (userId, lobbyId, entityId) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId || inst.data.turn !== -1) return;

    const campfireEntity = InGameHelpers.getEntities(inst).find(
      (entity) => entity.id === entityId && entity.type === "campfire"
    );
    if (!campfireEntity) return;

    await db.delete(schema.lobbyEntity).where(eq(schema.lobbyEntity.id, campfireEntity.id));
    await refresh(ctx, lobbyId);
  });

  socket.on("game:campfire:move", async (userId, lobbyId, entityId, position) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId || inst.data.turn !== -1) return;
    if (!isPosition(position)) return;

    const campfireEntity = InGameHelpers.getEntities(inst).find(
      (entity) => entity.id === entityId && entity.type === "campfire"
    );
    if (!campfireEntity) return;

    const blockedByWall = inst.data.walls.some(
      (wall) => wall.x === position.x && wall.z === position.z
    );
    if (blockedByWall) return;

    await db
      .update(schema.lobbyEntity)
      .set({ position })
      .where(eq(schema.lobbyEntity.id, campfireEntity.id));

    await refresh(ctx, lobbyId);
  });

socket.on("game:campfire:rest", async (userId, lobbyId, characterEntityId, actionsToRest) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;

    const charEntity = InGameHelpers.getEntities(inst).find((e) => e.id === characterEntityId);
    if (!charEntity || charEntity.type !== "character") return;

    if (charEntity.ownerId !== userId && inst.masterId !== userId) return;

    const actions = normalizeQuantity(actionsToRest);
    const currentActions = charEntity.actions ?? charEntity.maxActions ?? 0;

    if (actions > currentActions) return;

const healing = InGameHelpers.calculateRestHealing(charEntity, actions);
    const newHp = Math.min(charEntity.hp + healing, charEntity.maxHp);

    const newActions = currentActions - actions;

await db.transaction(async (tx) => {
      await tx
        .update(schema.character)
        .set({ hp: newHp })
        .where(eq(schema.character.id, charEntity.characterId));

      await tx
        .update(schema.lobbyEntity)
        .set({ actions: newActions })
        .where(eq(schema.lobbyEntity.id, charEntity.id));
    });

    await refresh(ctx, lobbyId, "game:campfire:rest:complete");
  });

socket.on("game:campfire:shop:setup", async (userId, lobbyId, campfireEntityId, itemsList) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId) return;

    const campfireEntity = InGameHelpers.getEntityById(inst, campfireEntityId);
    if (!campfireEntity || campfireEntity.type !== "campfire") return;

await db
      .delete(schema.campfireShopItem)
      .where(eq(schema.campfireShopItem.campfireId, campfireEntity.campfireId));

if (itemsList && itemsList.length > 0) {
      await db
        .insert(schema.campfireShopItem)
        .values(
          itemsList.map((item: { itemId: string; cost: number }) => ({
            campfireId: campfireEntity.campfireId,
            itemId: item.itemId,
            cost: item.cost,
          }))
        );
    }

    await refresh(ctx, lobbyId);
  });

  socket.on("game:campfire:shop:buy", async (userId, lobbyId, characterEntityId, itemId, qty) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;

    const charEntity = InGameHelpers.getEntities(inst).find((e) => e.id === characterEntityId);
    if (!charEntity || charEntity.type !== "character") return;

    if (charEntity.ownerId !== userId && inst.masterId !== userId) return;

    const quantity = normalizeQuantity(qty);

let shopItem = null;
    for (const entity of InGameHelpers.getEntities(inst)) {
      if (entity.type === "campfire") {
        const found = entity.shopItems.find((si) => si.id === itemId);
        if (found) {
          shopItem = found;
          break;
        }
      }
    }

    if (!shopItem) return;

    const totalCost = shopItem.cost * quantity;

const currencyItem = await db.query.item.findFirst({
      where: eq(schema.item.name, "Gold Coin"),
    });
    if (!currencyItem) return;

const currencyInv = charEntity.inventory.find((inv) => inv.id === currencyItem.id);
    if (!currencyInv || currencyInv.quantity < totalCost) {
      socket.emit("error", "Insufficient currency");
      return;
    }

await db.transaction(async (tx) => {
      
      const remaining = currencyInv.quantity - totalCost;
      if (remaining <= 0) {
        await tx
          .delete(schema.inventory)
          .where(
            and(
              eq(schema.inventory.characterId, charEntity.characterId),
              eq(schema.inventory.itemId, currencyItem.id)
            )
          );
      } else {
        await tx
          .update(schema.inventory)
          .set({ quantity: remaining })
          .where(
            and(
              eq(schema.inventory.characterId, charEntity.characterId),
              eq(schema.inventory.itemId, currencyItem.id)
            )
          );
      }

await upsertCharacterInventory(tx, charEntity.characterId, itemId, quantity);
    });

    await refresh(ctx, lobbyId, "game:campfire:purchase");
  });

  socket.on("game:campfire:info", async (userId, lobbyId, campfireEntityId) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;

    const campfireEntity = InGameHelpers.getEntityById(inst, campfireEntityId);
    if (!campfireEntity || campfireEntity.type !== "campfire") return;

    socket.emit("game:campfire:info", {
      campfireId: campfireEntity.id,
      shopItems: (campfireEntity as any).shopItems,
    });
  });
};
