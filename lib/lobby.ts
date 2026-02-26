"use server";

import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import { and, eq } from "drizzle-orm";

const normalizeData = (data: Partial<Game.Data> & Record<string, unknown>): Game.Data => ({
  turn: typeof data.turn === "number" ? data.turn : -1,
  walls: Array.isArray(data.walls) ? data.walls : [],
  sequence: Array.isArray(data.sequence) ? data.sequence : [],
});

export type Lobby = {
  id: string;
  name: string;
  createdAt: Date;
  members: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  messages: { id: string; createdAt: Date; lobbyId: string; senderId: string; content: string }[];
};

export const getAll = async (userId: string): Promise<Lobby[]> => {
  const data = await db.query.lobbyMember.findMany({
    where: eq(schema.lobbyMember.userId, userId),
    with: { lobby: { with: { members: { columns: {}, with: { user: true } }, messages: true } } },
  });

  return data.map(({ lobby }) => ({
    ...lobby,
    members: lobby.members.map((m) => m.user),
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
        },
      },
      members: { columns: {}, with: { user: true } },
    },
  });
  if (!results) throw new Error(`Lobby with id ${lobbyId} not found`);

  const data = normalizeData(results.data as any);

  const entities = results.entities.map((e) => {
    if (e.type === "character") {
      const playable = e.character!;
      return { ...e, actions: e.actions ?? playable.maxActions ?? 0, type: "character", playable };
    }

    if (e.type === "chest") {
      const playable = e.chest!;
      return { ...e, actions: 0, type: "chest", playable };
    }

    const playable = e.monster!;
    return { ...e, actions: e.actions ?? playable.maxActions ?? 0, type: "monster", playable };
  }) satisfies Game.Entity[];

  return { ...results, data, entities, members: results.members.map((m) => m.user) };
};

export const link = async (lobbyId: string, characterId: string) => {
  return await db.transaction(async (tx) => {
    const character = await tx.query.character.findFirst({
      where: eq(schema.character.id, characterId),
    });
    if (!character) throw new Error("Character not found");

    const [entity] = await tx
      .insert(schema.lobbyEntity)
      .values({ lobbyId, characterId, type: "character" })
      .returning();

    return character;
  });
};

export const create = async (userId: string, name: string): Promise<Lobby> => {
  return await db.transaction(async (tx) => {
    const [newLobby] = await tx.insert(schema.lobby).values({ name, masterId: userId }).returning();
    await tx.insert(schema.lobbyMember).values({ lobbyId: newLobby.id, userId });

    const result = await tx.query.lobby.findFirst({
      where: eq(schema.lobby.id, newLobby.id),
      with: { members: { columns: {}, with: { user: true } }, messages: true },
    });

    if (!result) throw new Error("Failed to retrieve created lobby.");
    return { ...result, members: result.members.map((m) => m.user), messages: [] };
  });
};

export const leave = async (userId: string, lobbyId: string) => {
  return await db.transaction(async (tx) => {
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
    with: { members: { columns: {}, with: { user: true } }, messages: true },
  });

  if (!result) throw new Error("Lobby not found.");
  return { ...result, members: result.members.map((m) => m.user) };
};

export const send = async (userId: string, lobbyId: string, content: string) => {
  const [newMessage] = await db
    .insert(schema.message)
    .values({ senderId: userId, lobbyId, content })
    .returning();
  return newMessage;
};
