"use server";

import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

/** Represents the character lobby type. */
export type CharacterLobby = { id: string; name: string; memberCount: number; members: string[] };

/** Represents the character with lobby type. */
export type CharacterWithLobby = Game.Character & { lobbies: CharacterLobby[] };

/** Represents the lobby info type. */
export type LobbyInfo = {
  id: string;
  name: string;
  createdAt: Date;
  memberCount: number;
  characterCount: number;
  isMember: boolean;
  unreadCount?: number;
};

/**
 * Get all characters owned by a user with their lobby information
 */
export const getCharacters = unstable_cache(
  async (userId: string) => {
    const results = await db.query.character.findMany({
      where: eq(schema.character.ownerId, userId),
      with: {
        inventory: { with: { item: true } },
        lobbyEntities: {
          columns: { lobbyId: true },
          with: { lobby: { with: { members: { columns: {}, with: { user: true } } } } },
        },
      },
    });

    return results.map(({ inventory, lobbyEntities, ...character }) => {
      const lobbies = new Map<string, CharacterLobby>();

      for (const entry of lobbyEntities) {
        if (!entry.lobby || lobbies.has(entry.lobby.id)) continue;

        lobbies.set(entry.lobby.id, {
          id: entry.lobby.id,
          name: entry.lobby.name,
          memberCount: entry.lobby.members.length,
          members: entry.lobby.members.map((member) => member.user.name),
        });
      }

      return {
        ...character,
        inventory: inventory.map((i) => ({ ...i, ...i.item })),
        lobbies: [...lobbies.values()],
      };
    }) as CharacterWithLobby[];
  },
  [],
  { tags: ["characters"] }
);

/**
 * Get lobbies the user is a member of
 */
export const getMyLobbies = async (userId: string): Promise<LobbyInfo[]> => {
  const lobbies = await db.query.lobby.findMany({
    with: {
      members: { columns: { userId: true } },
      entities: { columns: { type: true, characterId: true } },
    },
    orderBy: (lobby, { desc }) => [desc(lobby.createdAt)],
  });

  return lobbies
    .filter((lobby) => lobby.members.some((m) => m.userId === userId))
    .map((lobby) => ({
      id: lobby.id,
      name: lobby.name,
      createdAt: lobby.createdAt,
      memberCount: lobby.members.length,
      characterCount: lobby.entities.filter(
        (entity) => entity.type === "character" && entity.characterId
      ).length,
      isMember: true,
    }));
};
