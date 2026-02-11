import { relations } from "drizzle-orm";
import { account, session, user } from "./auth-schema";
import {
  character,
  inventory,
  item,
  lobby,
  lobbyEntity,
  lobbyMember,
  message,
  monster,
} from "./lobby-schema";

export const itemRelations = relations(item, ({ many }) => ({ inventories: many(inventory) }));

export const characterRelations = relations(character, ({ many, one }) => ({
  inventory: many(inventory),
  lobbyEntities: many(lobbyEntity),
  owner: one(user, { fields: [character.ownerId], references: [user.id] }),
}));

export const lobbyEntityRelations = relations(lobbyEntity, ({ one }) => ({
  lobby: one(lobby, { fields: [lobbyEntity.lobbyId], references: [lobby.id] }),
  character: one(character, { fields: [lobbyEntity.characterId], references: [character.id] }),
  monster: one(monster, { fields: [lobbyEntity.monsterId], references: [monster.id] }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  character: one(character, { fields: [inventory.characterId], references: [character.id] }),
  item: one(item, { fields: [inventory.itemId], references: [item.id] }),
}));

export const lobbyRelations = relations(lobby, ({ one, many }) => ({
  members: many(lobbyMember),
  messages: many(message),
  entities: many(lobbyEntity),
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

export const monsterRelations = relations(monster, ({ many }) => ({
  lobbyEntities: many(lobbyEntity),
}));
