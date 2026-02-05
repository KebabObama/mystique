"use server";

import { db } from "@/lib/db";
import { Game } from "@/lib/game";
import { schema } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createCharacter = async (
  userId: string,
  data: Game.Character,
  options?: { path?: string }
) => {
  try {
    const [newChar] = await db
      .insert(schema.character)
      .values({
        ownerId: userId,
        name: data.name,
        race: data.race,
        attributes: data.attributes,
        hp: data.maxHp,
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
