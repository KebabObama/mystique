"use server";

import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import { InGameHelpers } from "@/lib/ingame-helpers";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

type StartingInventoryItem = { itemId: string; quantity: number };

const STARTING_COINS = 100;

/** Provides the get all items function. */
export const getAllItems = async () => {
  try {
    const items = await db.select().from(schema.item);
    return { success: true, items };
  } catch (error) {
    return { success: false, items: [], error: "Failed to fetch items" };
  }
};

/** Provides the create character function. */
export const createCharacter = async (
  userId: string,
  data: Game.Character,
  startingInventory: StartingInventoryItem[] = [],
  options?: { path?: string }
) => {
  try {
    const inventoryByItemId = new Map<string, number>();

    for (const entry of startingInventory) {
      if (!entry.itemId || entry.quantity <= 0) continue;
      inventoryByItemId.set(
        entry.itemId,
        (inventoryByItemId.get(entry.itemId) ?? 0) + entry.quantity
      );
    }

    const normalizedInventory = [...inventoryByItemId.entries()].map(([itemId, quantity]) => ({
      itemId,
      quantity,
    }));

    const selectedItems = normalizedInventory.length
      ? await db
          .select()
          .from(schema.item)
          .where(
            inArray(
              schema.item.id,
              normalizedInventory.map((entry) => entry.itemId)
            )
          )
      : [];

    const selectedItemMap = new Map(selectedItems.map((item) => [item.id, item]));
    const persistedInventory = normalizedInventory.filter((entry) =>
      selectedItemMap.has(entry.itemId)
    );
    const totalWeight = persistedInventory.reduce(
      (sum, entry) => sum + (selectedItemMap.get(entry.itemId)?.weight ?? 0) * entry.quantity,
      0
    );
    const totalCost = persistedInventory.reduce(
      (sum, entry) => sum + (selectedItemMap.get(entry.itemId)?.value ?? 0) * entry.quantity,
      0
    );

    if (totalCost > STARTING_COINS) {
      return { success: false, error: "Selected items exceed starting coins" };
    }

    const stats = InGameHelpers.calculateCharacterStats(data, { weight: totalWeight, armor: 0 });

    const newChar = await db.transaction(async (tx) => {
      const [createdCharacter] = await tx
        .insert(schema.character)
        .values({
          ownerId: userId,
          name: data.name,
          race: data.race,
          attributes: data.attributes,
          hp: stats.maxHp,
          maxHp: stats.maxHp,
          maxActions: stats.maxActions,
          stamina: stats.stamina,
          weight: stats.weight,
          maxWeight: stats.maxWeight,
          maxMemory: stats.maxMemory,
          armor: stats.armor,
          coins: Math.max(STARTING_COINS - totalCost, 0),
        })
        .returning();

      if (persistedInventory.length > 0) {
        await tx
          .insert(schema.inventory)
          .values(
            persistedInventory.map((entry) => ({
              characterId: createdCharacter.id,
              itemId: entry.itemId,
              quantity: entry.quantity,
              equipped: false,
            }))
          );
      }

      return createdCharacter;
    });   
    revalidateTag("characters");
    return { success: true, character: newChar };
  } catch (error) {
    return { success: false, error: "Internal Server Error" };
  }
};

/** Provides the delete character function. */
export const deleteCharacter = async (characterId: string, options?: { path?: string }) => {
  try {
    await db.delete(schema.character).where(eq(schema.character.id, characterId));
    revalidatePath(options?.path || "/(classic)/dashboard");
    revalidateTag("characters");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Internal Server Error" };
  }
};

/** Provides the unlink character from lobby function. */
export const unlinkCharacterFromLobby = async (
  characterId: string,
  options?: { path?: string }
) => {
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(schema.character)
        .set({ lobbyId: null })
        .where(eq(schema.character.id, characterId));
      await tx
        .delete(schema.lobbyEntity)
        .where(
          and(
            eq(schema.lobbyEntity.characterId, characterId),
            eq(schema.lobbyEntity.type, "character")
          )
        );
    });
    revalidatePath(options?.path || "/dashboard");
    revalidateTag("characters");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Internal Server Error" };
  }
};
