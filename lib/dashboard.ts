"use server";

import type { LobbyInfo } from "@/components/dashboard/lobby-card";
import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
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
 * Get all lobbies with summary information
 */
export const getLobbies = async (userId: string): Promise<LobbyInfo[]> => {
  const lobbies = await db.query.lobby.findMany({
    with: { members: { columns: { userId: true } }, characters: { columns: { id: true } } },
    orderBy: (lobby, { desc }) => [desc(lobby.createdAt)],
  });

  return lobbies.map((lobby) => ({
    id: lobby.id,
    name: lobby.name,
    createdAt: lobby.createdAt,
    memberCount: lobby.members.length,
    characterCount: lobby.characters.length,
    isMember: lobby.members.some((m) => m.userId === userId),
  }));
};

/**
 * Get lobbies the user is a member of
 */
export const getMyLobbies = async (userId: string): Promise<LobbyInfo[]> => {
  const allLobbies = await getLobbies(userId);
  return allLobbies.filter((lobby) => lobby.isMember);
};

/**
 * Get lobbies available to join (user is not a member)
 */
export const getAvailableLobbies = async (userId: string): Promise<LobbyInfo[]> => {
  const allLobbies = await getLobbies(userId);
  return allLobbies.filter((lobby) => !lobby.isMember);
};

