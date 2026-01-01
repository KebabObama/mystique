"use server";

import { lobby, lobbyMember, message } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export namespace Lobby {
  export type Type = {
    members: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[];
    id: string;
    name: string | null;
    data: unknown;
    createdAt: Date;
    messages: { id: string; createdAt: Date; lobbyId: string; senderId: string; content: string }[];
  };

  // prettier-ignore
  export const getAll = async (userId: string) => {
    const data = await db.query.lobbyMember.findMany({
      where: eq(lobbyMember.userId, userId),
      with: { lobby: { with: {
        members: { columns: {}, with: { user: true } },
        messages: { },
      }}},
    });
    return data.map(({ lobby }) => ({
      ...lobby, members: lobby.members.map((m) => m.user),
    })) satisfies Lobby.Type[];
  };

  // prettier-ignore
  export const create = async (userId: string, name: string): Promise<Type> => {
    return await db.transaction(async (tx) => {
      const [newLobby] = await tx.insert(lobby).values({ name, data: {} }).returning();
      await tx.insert(lobbyMember).values({ lobbyId: newLobby.id, userId: userId });
      const result = await tx.query.lobby.findFirst({
        where: eq(lobby.id, newLobby.id),
        with: { members: { columns: {}, with: { user: true } } },
      });
      if (!result) throw new Error("Failed to retrieve created lobby.");
      return { ...result, members: result.members.map((m) => m.user), messages: [] } satisfies Lobby.Type;
    });
  };
  // prettier-ignore
  export const join = async (userId: string, lobbyId: string) => {
    await db.insert(lobbyMember).values({ lobbyId, userId }).onConflictDoNothing().catch(()=> {
      throw new Error("Lobby not found or join failed.");
    });
    const result = await db.query.lobby.findFirst({
      where: eq(lobby.id, lobbyId),
      with: {
        members: { columns: {}, with: { user: true } },
        messages: { },
      },
    });
    if (!result) throw new Error("Lobby not found.");
    const { members, ...lobbyData } = result;
    return { ...lobbyData, members: members.map((m) => m.user) } satisfies Lobby.Type;
  };

  // prettier-ignore
  export const send = async (userId: string, lobbyId: string, content: string ) => {
    return await db.insert(message).values({senderId: userId, lobbyId, content}).returning().then(e=>e[0]);
  };
}

