import { relations } from "drizzle-orm";
import { account, session, user } from "./auth-schema";
import {
  character,
  inventory,
  item,
  lobby,
  lobbyCharacter,
  lobbyMember,
  message,
} from "./lobby-schema";

export const itemRelations = relations(item, ({ many }) => ({ inventories: many(inventory) }));

export const characterRelations = relations(character, ({ many, one }) => ({
  inventory: many(inventory),
  lobbyCharacters: many(lobbyCharacter),
  owner: one(user, { fields: [character.ownerId], references: [user.id] }),
}));

export const lobbyCharacterRelations = relations(lobbyCharacter, ({ one }) => ({
  lobby: one(lobby, { fields: [lobbyCharacter.lobbyId], references: [lobby.id] }),
  character: one(character, { fields: [lobbyCharacter.characterId], references: [character.id] }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  character: one(character, { fields: [inventory.characterId], references: [character.id] }),
  item: one(item, { fields: [inventory.itemId], references: [item.id] }),
}));

export const lobbyRelations = relations(lobby, ({ one, many }) => ({
  members: many(lobbyMember),
  messages: many(message),
  characters: many(lobbyCharacter),
}));

export const lobbyMemberRelations = relations(lobbyMember, ({ one }) => ({
  lobby: one(lobby, { fields: [lobbyMember.lobbyId], references: [lobby.id] }),
  user: one(user, { fields: [lobbyMember.userId], references: [user.id] }),
}));

export const messageRelations = relations(message, ({ one }) => ({
  lobby: one(lobby, { fields: [message.lobbyId], references: [lobby.id] }),
  sender: one(user, { fields: [message.senderId], references: [user.id] }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  characters: many(character),
  lobbyMemberships: many(lobbyMember),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));
