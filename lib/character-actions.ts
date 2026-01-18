"use server";

import { character } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import type { Game } from "./game";

export const createCharacter = async (userId: string, data: Game.Character) => {
  try {
    const [newChar] = await db
      .insert(character)
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
    await db.delete(character).where(eq(character.id, characterId));
    return { success: true };
  } catch (error) {
    return { success: false, error: "Internal Server Error" };
  }
};

