"use server";

import { db, schema } from "@/lib/db";
import { Game } from "@/types";
import type { Lobby } from "@/types/lobby";
import { and, eq, gt } from "drizzle-orm";

const normalizeData = (data: Partial<Game.Data> & Record<string, unknown>): Game.Data => ({
  turn: typeof data.turn === "number" ? data.turn : -1,
  walls: Array.isArray(data.walls) ? data.walls : [],
  sequence: Array.isArray(data.sequence) ? data.sequence : [],
});

export const getAll = async (userId: string): Promise<Array<Lobby>> => {
  const data = await db.query.lobbyMember.findMany({
    where: eq(schema.lobbyMember.userId, userId),
    with: { lobby: { with: { members: { with: { user: true } }, messages: true } } },
  });

  return data.map(({ lobby }) => ({
    ...lobby,
    members: lobby.members.map((m) => ({ ...m.user, lastReadAt: m.lastReadAt })),
    messages: lobby.messages,
  }));
};

export const getInstance = async (lobbyId: string, tx?: typeof db): Promise<Game.Instance> => {
  const q = tx ?? db;
  const results = await q.query.lobby.findFirst({
    where: eq(schema.lobby.id, lobbyId),
    with: {
      entities: {
        with: {
          character: { with: { inventory: { with: { item: true } } } },
          monster: true,
          chest: { with: { inventory: { with: { item: true } } } },
          campfire: { with: { shopItems: { with: { item: true } } } },
        },
      },
      members: { columns: {}, with: { user: true } },
    },
  });
  if (!results) throw new Error(`Lobby with id ${lobbyId} not found`);

  const data = normalizeData(results.data as any);

  const entities: Array<Game.Entity> = results.entities.map((e): Game.Entity => {
    if (e.type === "character") {
      const character = e.character!;
      return {
        ...character,
        id: e.id,
        characterId: character.id,
        position: e.position,
        actions: e.actions ?? character.maxActions ?? 0,
        type: "character",
        inventory: character.inventory.map((inv) => ({
          ...inv.item,
          equipped: inv.equipped,
          quantity: inv.quantity,
        })),
      } as any;
    }

    if (e.type === "chest") {
      const chest = e.chest!;
      return {
        ...chest,
        id: e.id,
        chestId: chest.id,
        position: e.position,
        actions: 0,
        type: "chest",
        inventory: chest.inventory.map((inv) => ({ ...inv.item, quantity: inv.quantity })),
      } as any;
    }

    if (e.type === "campfire") {
      const campfire = e.campfire!;
      return {
        ...campfire,
        id: e.id,
        campfireId: campfire.id,
        position: e.position,
        actions: 0,
        type: "campfire",
        shopItems: campfire.shopItems.map((shop) => ({ ...shop.item, cost: shop.cost })),
      } as any;
    }

    const monster = e.monster!;
    return {
      ...monster,
      id: e.id,
      monsterId: monster.id,
      position: e.position,
      actions: e.actions ?? monster.maxActions ?? 0,
      type: "monster",
    } as any;
  });

  const characters = entities.filter(
    (entity): entity is Game.CharacterEntity => entity.type === "character"
  );
  const monsters = entities.filter(
    (entity): entity is Game.MonsterEntity => entity.type === "monster"
  );
  const chests = entities.filter((entity): entity is Game.ChestEntity => entity.type === "chest");
  const campfires = entities.filter(
    (entity): entity is Game.CampfireEntity => entity.type === "campfire"
  );

  return {
    ...results,
    data,
    characters,
    monsters,
    chests,
    campfires,
    members: results.members.map((m) => m.user),
  };
};

export const link = async (lobbyId: string, characterId: string) => {
  return await db.transaction(async (tx) => {
    // Check if character already in another lobby
    const character = await tx.query.character.findFirst({
      where: eq(schema.character.id, characterId),
    });
    if (!character) throw new Error("Character not found");
    if (character.lobbyId) throw new Error("Character already in a lobby");

    // Update character with lobby reference
    const [updated] = await tx
      .update(schema.character)
      .set({ lobbyId })
      .where(eq(schema.character.id, characterId))
      .returning();

    // Create lobby entity for game mechanics
    await tx
      .insert(schema.lobbyEntity)
      .values({ lobbyId, characterId, type: "character" })
      .returning();

    return updated;
  });
};

export const create = async (userId: string, name: string): Promise<Lobby> => {
  return await db.transaction(async (tx) => {
    const [newLobby] = await tx.insert(schema.lobby).values({ name, masterId: userId }).returning();
    await tx.insert(schema.lobbyMember).values({ lobbyId: newLobby.id, userId });

    const result = await tx.query.lobby.findFirst({
      where: eq(schema.lobby.id, newLobby.id),
      with: { members: { with: { user: true } }, messages: true },
    });

    if (!result) throw new Error("Failed to retrieve created lobby.");
    return {
      ...result,
      members: result.members.map((m) => ({ ...m.user, lastReadAt: m.lastReadAt })),
      messages: [],
    };
  });
};

export const leave = async (userId: string, lobbyId: string) => {
  return await db.transaction(async (tx) => {
    // Unlink all characters owned by this user from this lobby
    await tx
      .update(schema.character)
      .set({ lobbyId: null })
      .where(and(eq(schema.character.ownerId, userId), eq(schema.character.lobbyId, lobbyId)));

    // Remove lobby member
    await tx
      .delete(schema.lobbyMember)
      .where(and(eq(schema.lobbyMember.userId, userId), eq(schema.lobbyMember.lobbyId, lobbyId)));

    const remaining = await tx
      .select()
      .from(schema.lobbyMember)
      .where(eq(schema.lobbyMember.lobbyId, lobbyId))
      .limit(1);

    if (remaining.length === 0) await tx.delete(schema.lobby).where(eq(schema.lobby.id, lobbyId));
  });
};

export const join = async (userId: string, lobbyId: string): Promise<Lobby> => {
  await db.insert(schema.lobbyMember).values({ lobbyId, userId }).onConflictDoNothing();

  const result = await db.query.lobby.findFirst({
    where: eq(schema.lobby.id, lobbyId),
    with: { members: { with: { user: true } }, messages: true },
  });

  if (!result) throw new Error("Lobby not found.");
  return {
    ...result,
    members: result.members.map((m) => ({ ...m.user, lastReadAt: m.lastReadAt })),
  };
};

export const send = async (userId: string, lobbyId: string, content: string) => {
  const [newMessage] = await db
    .insert(schema.message)
    .values({ senderId: userId, lobbyId, content })
    .returning();
  return newMessage;
};

export const markAsRead = async (userId: string, lobbyId: string): Promise<Date | null> => {
  // Get the user's current lastReadAt timestamp
  const member = await db.query.lobbyMember.findFirst({
    where: and(eq(schema.lobbyMember.userId, userId), eq(schema.lobbyMember.lobbyId, lobbyId)),
  });

  if (!member) return null;

  // Check if there are any unread messages (messages created after lastReadAt)
  const hasUnreadMessages = member.lastReadAt
    ? await db.query.message.findFirst({
        where: and(
          eq(schema.message.lobbyId, lobbyId),
          gt(schema.message.createdAt, member.lastReadAt)
        ),
      })
    : await db.query.message.findFirst({ where: eq(schema.message.lobbyId, lobbyId) });

  // Only update if there are unread messages
  if (hasUnreadMessages) {
    const lastReadAt = new Date();
    await db
      .update(schema.lobbyMember)
      .set({ lastReadAt })
      .where(and(eq(schema.lobbyMember.userId, userId), eq(schema.lobbyMember.lobbyId, lobbyId)));

    return lastReadAt;
  }

  return null;
};
