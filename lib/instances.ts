import { schema } from "@/lib/schema";

export namespace Instance {
  export type Type = typeof schema.lobby.$inferSelect & {
    members: (typeof schema.user.$inferSelect)[];
    characters: (typeof schema.character.$inferSelect)[];
    state: { turn: number; isStarted: boolean };
  };
  export const activeGames = new Map<string, Type>();
}

