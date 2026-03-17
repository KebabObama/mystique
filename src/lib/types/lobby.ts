import { lobby, message, user } from "@/db/schema";

export type Brand<K, T> = K & { readonly __brand?: T };

export type SocketAuth = {
  userId: (typeof user.$inferSelect)["id"];
  lobbyId: (typeof lobby.$inferSelect)["id"];
};

export type Lobby = typeof lobby.$inferSelect & {
  members: Array<typeof user.$inferSelect & { lastReadAt: Date | null }>;
  messages: Array<typeof message.$inferSelect>;
};
