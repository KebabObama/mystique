import { db, schema } from "@/lib/db";
import { InGameHelpers } from "@/lib/ingame-helpers";
import * as Lobby from "@/lib/lobby";
import { Game } from "@/types";
import { and, eq } from "drizzle-orm";
import {
  type SocketContext,
  exists,
  normalizeQuantity,
  update,
  upsertCharacterInventory,
  upsertChestInventory,
} from "./helpers";

export const register = (ctx: SocketContext) => {
  const { socket } = ctx;

  socket.on("game:inventory:grant", async (userId, lobbyId, targetEntityId, itemId, qty) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId) return;

    const target = InGameHelpers.getEntityById(inst, targetEntityId);
    if (!target || target.type === "monster") return;

    const item = await db.query.item.findFirst({ where: eq(schema.item.id, itemId) });
    if (!item) return;

    const quantity = normalizeQuantity(qty);

    await db.transaction(async (tx) => {
      if (target.type === "character") {
        await upsertCharacterInventory(tx, target.id, item.id, quantity);
        return;
      }

      await upsertChestInventory(tx, target.id as any, item.id, quantity);
    });

    const fresh = await Lobby.getInstance(lobbyId);
    await update(ctx, fresh);
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
      if (fromEntity.type === "monster" || toEntity.type === "monster") return;

      const isMaster = inst.masterId === userId;
      if (!isMaster) {
        const userCharacter = (entity: Game.Entity) =>
          entity.type === "character" && entity.ownerId === userId;

        const validPlayerMove =
          (userCharacter(fromEntity) && toEntity.type === "chest") ||
          (fromEntity.type === "chest" && userCharacter(toEntity));

        if (!validPlayerMove) return;
      }

      await db.transaction(async (tx) => {
        if (fromEntity.type === "character") {
          const source = await tx.query.inventory.findFirst({
            where: and(
              eq(schema.inventory.characterId, fromEntity.id),
              eq(schema.inventory.itemId, itemId)
            ),
          });
          if (!source || source.quantity < quantity) return;

          if (source.quantity === quantity) {
            await tx
              .delete(schema.inventory)
              .where(
                and(
                  eq(schema.inventory.characterId, fromEntity.id),
                  eq(schema.inventory.itemId, itemId)
                )
              );
          } else {
            await tx
              .update(schema.inventory)
              .set({ quantity: source.quantity - quantity })
              .where(
                and(
                  eq(schema.inventory.characterId, fromEntity.id),
                  eq(schema.inventory.itemId, itemId)
                )
              );
          }
        } else {
          const source = await tx.query.chestInventory.findFirst({
            where: and(
              eq(schema.chestInventory.chestId, fromEntity.id as any),
              eq(schema.chestInventory.itemId, itemId)
            ),
          });
          if (!source || source.quantity < quantity) return;

          if (source.quantity === quantity) {
            await tx
              .delete(schema.chestInventory)
              .where(
                and(
                  eq(schema.chestInventory.chestId, fromEntity.id as any),
                  eq(schema.chestInventory.itemId, itemId)
                )
              );
          } else {
            await tx
              .update(schema.chestInventory)
              .set({ quantity: source.quantity - quantity })
              .where(
                and(
                  eq(schema.chestInventory.chestId, fromEntity.id as any),
                  eq(schema.chestInventory.itemId, itemId)
                )
              );
          }
        }

        if (toEntity.type === "character") {
          await upsertCharacterInventory(tx, toEntity.id, itemId, quantity);
          return;
        }

        await upsertChestInventory(tx, toEntity.id as any, itemId, quantity);
      });

      const fresh = await Lobby.getInstance(lobbyId);
      await update(ctx, fresh);
    }
  );

  socket.on("game:inventory:delete", async (userId, lobbyId, entityId, itemId, qty) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId) return;
    if (typeof itemId !== "string") return;

    const quantity = normalizeQuantity(qty);
    const entity = InGameHelpers.getEntityById(inst, entityId);
    if (!entity || entity.type === "monster") return;

    await db.transaction(async (tx) => {
      if (entity.type === "character") {
        const source = await tx.query.inventory.findFirst({
          where: and(
            eq(schema.inventory.characterId, entity.id),
            eq(schema.inventory.itemId, itemId)
          ),
        });
        if (!source || source.quantity < quantity) return;

        if (source.quantity === quantity) {
          await tx
            .delete(schema.inventory)
            .where(
              and(eq(schema.inventory.characterId, entity.id), eq(schema.inventory.itemId, itemId))
            );
        } else {
          await tx
            .update(schema.inventory)
            .set({ quantity: source.quantity - quantity })
            .where(
              and(eq(schema.inventory.characterId, entity.id), eq(schema.inventory.itemId, itemId))
            );
        }
      } else {
        const source = await tx.query.chestInventory.findFirst({
          where: and(
            eq(schema.chestInventory.chestId, entity.id as any),
            eq(schema.chestInventory.itemId, itemId)
          ),
        });
        if (!source || source.quantity < quantity) return;

        if (source.quantity === quantity) {
          await tx
            .delete(schema.chestInventory)
            .where(
              and(
                eq(schema.chestInventory.chestId, entity.id as any),
                eq(schema.chestInventory.itemId, itemId)
              )
            );
        } else {
          await tx
            .update(schema.chestInventory)
            .set({ quantity: source.quantity - quantity })
            .where(
              and(
                eq(schema.chestInventory.chestId, entity.id as any),
                eq(schema.chestInventory.itemId, itemId)
              )
            );
        }
      }
    });

    const fresh = await Lobby.getInstance(lobbyId);
    await update(ctx, fresh);
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

    await db.transaction(async (tx) => {
      const source = await tx.query.inventory.findFirst({
        where: and(
          eq(schema.inventory.characterId, entity.id),
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
            and(eq(schema.inventory.characterId, entity.id), eq(schema.inventory.itemId, itemId))
          );
      } else {
        await tx
          .update(schema.inventory)
          .set({ quantity: source.quantity - safeDrop })
          .where(
            and(eq(schema.inventory.characterId, entity.id), eq(schema.inventory.itemId, itemId))
          );
      }
    });

    const fresh = await Lobby.getInstance(lobbyId);
    await update(ctx, fresh);
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
      where: and(eq(schema.inventory.characterId, entity.id), eq(schema.inventory.itemId, itemId)),
      with: { item: true },
    });
    if (!entry) return;
    if (entry.item.type === "misc") return;

    // Equipment slot limit validation
    if (!entry.equipped) {
      const equippedCount = await db.query.inventory.findMany({
        where: and(
          eq(schema.inventory.characterId, entity.id),
          eq(schema.inventory.equipped, true)
        ),
        with: { item: true },
      });

      const itemType = entry.item.type;
      const equippedOfType = equippedCount.filter((inv) => inv.item.type === itemType);

      // Enforce slot limits: 1 for weapon/helmet/armor/leggings, 2 for ring
      const maxSlots = itemType === "ring" ? 2 : 1;
      if (equippedOfType.length >= maxSlots) return;
    }

    await db
      .update(schema.inventory)
      .set({ equipped: !entry.equipped })
      .where(and(eq(schema.inventory.characterId, entity.id), eq(schema.inventory.itemId, itemId)));

    const fresh = await Lobby.getInstance(lobbyId);
    await update(ctx, fresh);
  });
};
