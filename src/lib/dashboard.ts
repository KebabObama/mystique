"use server";

import type { LobbyInfo } from "@/components/dashboard/lobby-card";
import { db, schema } from "@/lib/db";
import { Game } from "@/types";
import { eq } from "drizzle-orm";

/**
 * Get all characters owned by a user with their lobby information
 */
export const getCharacters = async (userId: string) => {
  const results = await db.query.character.findMany({
    where: eq(schema.character.ownerId, userId),
    with: {
      inventory: { with: { item: true } },
      lobby: { with: { members: { columns: {}, with: { user: true } } } },
    },
  });

  return results.map((char) => ({
    ...char,
    inventory: char.inventory.map((i) => ({ ...i, ...i.item })),
    lobby: char.lobby
      ? {
          id: char.lobby.id,
          name: char.lobby.name,
          memberCount: char.lobby.members.length,
          members: char.lobby.members.map((m) => m.user.name),
        }
      : null,
  })) as (Game.Character & {
    lobby: { id: string; name: string; memberCount: number; members: string[] } | null;
  })[];
};

/**
 * Get lobbies the user is a member of
 */
export const getMyLobbies = async (userId: string): Promise<LobbyInfo[]> => {
  const lobbies = await db.query.lobby.findMany({
    with: { members: { columns: { userId: true } }, characters: { columns: { id: true } } },
    orderBy: (lobby, { desc }) => [desc(lobby.createdAt)],
  });

  return lobbies
    .filter((lobby) => lobby.members.some((m) => m.userId === userId))
    .map((lobby) => ({
      id: lobby.id,
      name: lobby.name,
      createdAt: lobby.createdAt,
      memberCount: lobby.members.length,
      characterCount: lobby.characters.length,
      isMember: true,
    }));
};
