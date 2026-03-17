"use server";

import { db, schema } from "@/lib/db";
import { InGameHelpers } from "@/lib/ingame-helpers";
import { Game } from "@/lib/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getAllItems = async () => {
  try {
    const items = await db.select().from(schema.item);
    return { success: true, items };
  } catch (error) {
    return { success: false, items: [], error: "Failed to fetch items" };
  }
};

export const createCharacter = async (
  userId: string,
  data: Game.Character,
  options?: { path?: string }
) => {
  try {
    const stats = InGameHelpers.calculateCharacterStats(data, { weight: 0, armor: 0 });
    const [newChar] = await db
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
        weight: 0,
        maxWeight: stats.maxWeight,
        maxMemory: stats.maxMemory,
        armor: 0,
        coins: 100,
      })
      .returning();

    // Add all items to the character's inventory
    const allItems = await db.select().from(schema.item);
    if (allItems.length > 0) {
      await db
        .insert(schema.inventory)
        .values(
          allItems.map((item) => ({
            characterId: newChar.id,
            itemId: item.id,
            quantity: 1,
            equipped: false,
          }))
        )
        .onConflictDoNothing();
    }

    revalidatePath(options?.path || "/dashboard");
    return { success: true, character: newChar };
  } catch (error) {
    return { success: false, error: "Internal Server Error" };
  }
};

export const deleteCharacter = async (characterId: string, options?: { path?: string }) => {
  try {
    await db.delete(schema.character).where(eq(schema.character.id, characterId));
    revalidatePath(options?.path || "/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Internal Server Error" };
  }
};

export const unlinkCharacterFromLobby = async (
  characterId: string,
  options?: { path?: string }
) => {
  try {
    await db.transaction(async (tx) => {
      // Remove character from lobby
      await tx
        .update(schema.character)
        .set({ lobbyId: null })
        .where(eq(schema.character.id, characterId));

      // Remove associated lobby entity
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
    return { success: true };
  } catch (error) {
    return { success: false, error: "Internal Server Error" };
  }
};
