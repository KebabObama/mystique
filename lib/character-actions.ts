"use server";

import { db } from "@/lib/db";
import { Game } from "@/lib/game";
import { schema } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const createCharacter = async (userId: string, data: Game.Character) => {
  try {
    const [newChar] = await db
      .insert(schema.character)
      .values({
        ownerId: userId,
        name: data.name,
        race: data.race,
        attributes: data.attributes,
        level: 1,
        xp: 0,
        hp: data.maxHp,
      })
      .returning();
    return { success: true, character: newChar };
  } catch (error) {
    return { success: false, error: "Internal Server Error" };
  }
};

export const deleteCharacter = async (characterId: string) => {
  try {
    await db.delete(schema.character).where(eq(schema.character.id, characterId));
    return { success: true };
  } catch (error) {
    return { success: false, error: "Internal Server Error" };
  }
};

