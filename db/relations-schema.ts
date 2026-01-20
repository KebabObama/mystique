import { relations } from "drizzle-orm";
import { account, session, user } from "./auth-schema";
import {
  character,
  characterEntity,
  entity,
  instance,
  inventory,
  item,
  monster,
  storage,
} from "./game-schema";
import { lobby, lobbyMember, message } from "./social-schema";

export const itemRelations = relations(item, ({ many }) => ({
  inventories: many(inventory),
  storages: many(storage),
}));

export const characterRelations = relations(character, ({ many, one }) => ({
  inventory: many(inventory),
  characterEntity: one(characterEntity, {
    fields: [character.id],
    references: [characterEntity.characterId],
  }),
  owner: one(user, { fields: [character.ownerId], references: [user.id] }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  character: one(character, { fields: [inventory.characterId], references: [character.id] }),
  item: one(item, { fields: [inventory.itemId], references: [item.id] }),
}));

export const instanceRelations = relations(instance, ({ one, many }) => ({
  lobby: one(lobby, { fields: [instance.lobbyId], references: [lobby.id] }),
  entities: many(entity),
}));

export const entityRelations = relations(entity, ({ one, many }) => ({
  instance: one(instance, { fields: [entity.instanceId], references: [instance.id] }),
  monster: one(monster, { fields: [entity.id], references: [monster.entityId] }),
  storage: many(storage),
  characterEntity: one(characterEntity, {
    fields: [entity.id],
    references: [characterEntity.entityId],
  }),
}));

export const characterEntityRelations = relations(characterEntity, ({ one }) => ({
  character: one(character, { fields: [characterEntity.characterId], references: [character.id] }),
  entity: one(entity, { fields: [characterEntity.entityId], references: [entity.id] }),
}));

export const monsterRelations = relations(monster, ({ one }) => ({
  entity: one(entity, { fields: [monster.entityId], references: [entity.id] }),
}));

export const storageRelations = relations(storage, ({ one }) => ({
  entity: one(entity, { fields: [storage.entityId], references: [entity.id] }),
  item: one(item, { fields: [storage.itemId], references: [item.id] }),
}));

export const lobbyRelations = relations(lobby, ({ one, many }) => ({
  members: many(lobbyMember),
  messages: many(message),
  instance: one(instance, { fields: [lobby.id], references: [instance.lobbyId] }),
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
