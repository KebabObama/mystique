import { relations } from "drizzle-orm";
import { account, session, user } from "./auth-schema";
import { character, gameCharacters, gameInstance, inventory, item } from "./game-schema";
import { lobby, lobbyMember, message } from "./social-schema";

// --- CHARACTER & INVENTORY ---
export const characterRelations = relations(character, ({ many, one }) => ({
  inventory: many(inventory),
  games: many(gameCharacters),
  owner: one(user, { fields: [character.ownerId], references: [user.id] }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  character: one(character, { fields: [inventory.characterId], references: [character.id] }),
  item: one(item, { fields: [inventory.itemId], references: [item.id] }),
}));

// --- LOBBY & CHAT (The Fixes are here) ---
export const lobbyRelations = relations(lobby, ({ one, many }) => ({
  // Added many relationships so lobby.members and lobby.messages work
  members: many(lobbyMember),
  messages: many(message),
  gameInstance: one(gameInstance, { fields: [lobby.id], references: [gameInstance.lobbyId] }),
}));

export const lobbyMemberRelations = relations(lobbyMember, ({ one }) => ({
  lobby: one(lobby, { fields: [lobbyMember.lobbyId], references: [lobby.id] }),
  user: one(user, { fields: [lobbyMember.userId], references: [user.id] }),
}));

export const messageRelations = relations(message, ({ one }) => ({
  // Changed 'group' to 'lobby' to match the table name and UI logic
  lobby: one(lobby, { fields: [message.lobbyId], references: [lobby.id] }),
  sender: one(user, { fields: [message.senderId], references: [user.id] }),
}));

// --- GAME LOGIC ---
export const gameInstanceRelations = relations(gameInstance, ({ one, many }) => ({
  lobby: one(lobby, { fields: [gameInstance.lobbyId], references: [lobby.id] }),
  characters: many(gameCharacters),
}));

export const gameCharactersRelations = relations(gameCharacters, ({ one }) => ({
  gameInstance: one(gameInstance, {
    fields: [gameCharacters.gameInstanceId],
    references: [gameInstance.id],
  }),
  character: one(character, { fields: [gameCharacters.characterId], references: [character.id] }),
}));

// --- AUTH & USER ---
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  characters: many(character), // Added so you can find characters from user
  lobbyMemberships: many(lobbyMember), // Added for reverse lookups
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

