"use server";

import { db } from "@/lib/db";
import { schema } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

export namespace Lobby {
  export type Type = {
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

  export const getAll = async (userId: string): Promise<Lobby.Type[]> => {
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

  export const create = async (userId: string, name: string): Promise<Lobby.Type> => {
    return await db.transaction(async (tx) => {
      const [newLobby] = await tx.insert(schema.lobby).values({ name }).returning();
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
      if (remaining.length === 0) {
        await tx.delete(schema.lobby).where(eq(schema.lobby.id, lobbyId));
      }
    });
  };

  export const join = async (userId: string, lobbyId: string): Promise<Lobby.Type> => {
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
}
