"use server";

import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createCharacter = async (
  userId: string,
  data: Game.Character,
  options?: { path?: string }
) => {
  try {
    const stats = Game.calculateCharacterStats(data, { weight: 0, armor: 0 });
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
      })
      .returning();
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
