import { schema } from "@/lib/schema";

export type Instance = typeof schema.lobby.$inferSelect & {
  members: (typeof schema.user.$inferSelect)[];
  characters: (typeof schema.character.$inferSelect)[];
  state: { turn: number; isStarted: boolean };
};

export const activeGames = new Map<string, Instance>();

