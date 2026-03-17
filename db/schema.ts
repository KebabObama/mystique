import { Game } from "@/lib/game";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const id = <T extends string>(name: string) => uuid(name).$type<Game.Brand<string, T>>();

/** Defines the user table schema. */
export const user = pgTable("user", {
  id: id<"userId">("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Defines the session table schema. */
export const session = pgTable(
  "session",
  {
    id: id<"sessionId">("id").primaryKey().defaultRandom(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: id<"userId">("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

/** Defines the account table schema. */
export const account = pgTable(
  "account",
  {
    id: id<"accountId">("id").primaryKey().defaultRandom(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: id<"userId">("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

/** Defines the verification table schema. */
export const verification = pgTable(
  "verification",
  {
    id: id<"verificationId">("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

/** Defines the item table schema. */
export const item = pgTable("item", {
  id: id<"itemId">("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  type: text("type", { enum: Game.ITEM_TYPES }).notNull().default("misc"),
  value: integer("value").notNull().default(0),
  weight: integer("weight").notNull().default(0),
  armor: integer("armor"),
  meshPath: text("mesh_path"), 
  abilities: json("abilities").notNull().$type<Game.Ability[]>(),
  requiremnts: json("regiments")
    .notNull()
    .$type<Partial<Record<Game.Attribute, number | null>>>()
    .default({}),
});

/** Defines the lobby table schema. */
export const lobby = pgTable("lobby", {
  id: id<"lobbyId">("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  data: jsonb("data").notNull().$type<Game.Data>().default(Game.INITIAL_DATA),
  masterId: id<"userId">("master_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

/** Defines the lobbyMember table schema. */
export const lobbyMember = pgTable(
  "lobby_member",
  {
    lobbyId: id<"lobbyId">("lobby_id")
      .notNull()
      .references(() => lobby.id, { onDelete: "cascade" }),
    userId: id<"userId">("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lastSeen: timestamp("last_seen")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    lastReadAt: timestamp("last_read_at").defaultNow(),
  },
  (table) => [
    primaryKey({ name: "lobby_member_pk", columns: [table.lobbyId, table.userId] }),
    index("member_user_idx").on(table.userId),
  ]
);

/** Defines the message table schema. */
export const message = pgTable(
  "message",
  {
    id: id<"messageId">("id").primaryKey().defaultRandom(),
    lobbyId: id<"lobbyId">("lobby_id")
      .notNull()
      .references(() => lobby.id, { onDelete: "cascade" }),
    senderId: id<"userId">("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("message_lobby_idx").on(table.lobbyId)]
);

/** Defines the character table schema. */
export const character = pgTable(
  "character",
  {
    id: id<"characterId">("id").primaryKey().defaultRandom(),
    ownerId: id<"userId">("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lobbyId: id<"lobbyId">("lobby_id").references(() => lobby.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    race: text("race", { enum: Game.RACES }).notNull(),
    level: integer("level").notNull().default(1),
    xp: integer("xp").notNull().default(0),
    meshPath: text("mesh_path"), 
    attributes: jsonb("attributes").notNull().$type<Record<Game.Attribute, number>>(),
    memory: integer("memory").notNull().default(2),
    hp: integer("hp").notNull().default(10),
    coins: integer("coins").notNull().default(0),
    maxHp: integer("max_hp").notNull().default(10),
    maxActions: integer("max_actions").notNull().default(0),
    stamina: integer("stamina").notNull().default(5),
    weight: integer("weight").notNull().default(0),
    maxWeight: integer("max_weight").notNull().default(10),
    maxMemory: integer("max_memory").notNull().default(2),
    armor: integer("armor").notNull().default(0),
  },
  (table) => [
    index("character_owner_idx").on(table.ownerId),
    index("character_lobby_idx").on(table.lobbyId),
  ]
);

/** Defines the inventory table schema. */
export const inventory = pgTable(
  "inventory",
  {
    characterId: id<"characterId">("character_id")
      .notNull()
      .references(() => character.id, { onDelete: "cascade" }),
    itemId: id<"itemId">("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    equipped: boolean("equipped").notNull().default(false),
  },
  (table) => [
    index("inventory_char_idx").on(table.characterId),
    primaryKey({ name: "inventory_pk", columns: [table.characterId, table.itemId] }),
  ]
);

/** Defines the monster table schema. */
export const monster = pgTable("monster", {
  id: id<"monsterId">("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  level: integer("level").notNull().default(1),
  hp: integer("hp").notNull().default(10),
  maxHp: integer("max_hp").notNull().default(10),
  armor: integer("armor").notNull().default(0),
  meshPath: text("mesh_path"), 
  stamina: integer("stamina").notNull().default(5),
  maxActions: integer("max_actions").notNull().default(1),
  memory: integer("memory").notNull().default(2),
  abilities: jsonb("abilities").notNull().$type<Game.Ability[]>().default([]),
});

/** Defines the chest table schema. */
export const chest = pgTable(
  "chest",
  {
    id: id<"chestId">("id").primaryKey().defaultRandom(),
    name: text("name").notNull().default("Chest"),
    meshPath: text("mesh_path"), 
  },
  (table) => [index("chest_name_idx").on(table.name)]
);

/** Defines the chestInventory table schema. */
export const chestInventory = pgTable(
  "chest_inventory",
  {
    chestId: id<"chestId">("chest_id")
      .notNull()
      .references(() => chest.id, { onDelete: "cascade" }),
    itemId: id<"itemId">("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
  },
  (table) => [
    index("chest_inventory_chest_idx").on(table.chestId),
    primaryKey({ name: "chest_inventory_pk", columns: [table.chestId, table.itemId] }),
  ]
);

/** Defines the campfire table schema. */
export const campfire = pgTable("campfire", {
  id: id<"campfireId">("id").primaryKey().defaultRandom(),
  name: text("name").notNull().default("Campfire"),
  meshPath: text("mesh_path"), 
});

/** Defines the campfireShopItem table schema. */
export const campfireShopItem = pgTable(
  "campfire_shop_item",
  {
    campfireId: id<"campfireId">("campfire_id")
      .notNull()
      .references(() => campfire.id, { onDelete: "cascade" }),
    itemId: id<"itemId">("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    cost: integer("cost").notNull(), 
  },
  (table) => [
    index("campfire_shop_item_campfire_idx").on(table.campfireId),
    primaryKey({ name: "campfire_shop_item_pk", columns: [table.campfireId, table.itemId] }),
  ]
);

/** Defines the lobbyEntity table schema. */
export const lobbyEntity = pgTable(
  "lobby_entity",
  {
    id: id<"lobbyEntityId">("id").primaryKey().defaultRandom(),
    lobbyId: id<"lobbyId">("lobby_id")
      .notNull()
      .references(() => lobby.id, { onDelete: "cascade" }),
    type: text("type", { enum: Game.ENTITY_TYPES }).notNull(),
    characterId: id<"characterId">("character_id").references(() => character.id, {
      onDelete: "cascade",
    }),
    monsterId: id<"monsterId">("monster_id").references(() => monster.id, { onDelete: "cascade" }),
    chestId: id<"chestId">("chest_id").references(() => chest.id, { onDelete: "cascade" }),
    campfireId: id<"campfireId">("campfire_id").references(() => campfire.id, {
      onDelete: "cascade",
    }),
    position: jsonb("position").notNull().$type<Game.Position>().default({ x: 0, z: 0 }),
    actions: integer("actions").notNull().default(0),
    effects: jsonb("effects")
      .notNull()
      .$type<Record<Game.Effect, number>>()
      .default(Game.EMPTY_EFFECTS),
    activeEffects: jsonb("active_effects")
      .notNull()
      .$type<Record<Game.Effect, number>>()
      .default(Game.EMPTY_EFFECTS),
  },
  (table) => [index("lobby_entity_lobby_idx").on(table.lobbyId)]
);

/** Defines the user relations relations. */
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  characters: many(character),
  lobbyMemberships: many(lobbyMember),
}));

/** Defines the session relations relations. */
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

/** Defines the account relations relations. */
export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

/** Defines the item relations relations. */
export const itemRelations = relations(item, ({ many }) => ({
  inventories: many(inventory),
  chestInventories: many(chestInventory),
}));

/** Defines the lobby relations relations. */
export const lobbyRelations = relations(lobby, ({ one, many }) => ({
  master: one(user, { fields: [lobby.masterId], references: [user.id] }),
  members: many(lobbyMember),
  messages: many(message),
  entities: many(lobbyEntity),
  characters: many(character),
}));

/** Defines the lobby member relations relations. */
export const lobbyMemberRelations = relations(lobbyMember, ({ one }) => ({
  lobby: one(lobby, { fields: [lobbyMember.lobbyId], references: [lobby.id] }),
  user: one(user, { fields: [lobbyMember.userId], references: [user.id] }),
}));

/** Defines the message relations relations. */
export const messageRelations = relations(message, ({ one }) => ({
  lobby: one(lobby, { fields: [message.lobbyId], references: [lobby.id] }),
  sender: one(user, { fields: [message.senderId], references: [user.id] }),
}));

/** Defines the character relations relations. */
export const characterRelations = relations(character, ({ many, one }) => ({
  inventory: many(inventory),
  lobbyEntities: many(lobbyEntity),
  owner: one(user, { fields: [character.ownerId], references: [user.id] }),
  lobby: one(lobby, { fields: [character.lobbyId], references: [lobby.id] }),
}));

/** Defines the inventory relations relations. */
export const inventoryRelations = relations(inventory, ({ one }) => ({
  character: one(character, { fields: [inventory.characterId], references: [character.id] }),
  item: one(item, { fields: [inventory.itemId], references: [item.id] }),
}));

/** Defines the monster relations relations. */
export const monsterRelations = relations(monster, ({ many }) => ({
  lobbyEntities: many(lobbyEntity),
}));

/** Defines the chest relations relations. */
export const chestRelations = relations(chest, ({ many }) => ({
  inventory: many(chestInventory),
  lobbyEntities: many(lobbyEntity),
}));

/** Defines the campfire relations relations. */
export const campfireRelations = relations(campfire, ({ many }) => ({
  shopItems: many(campfireShopItem),
  lobbyEntities: many(lobbyEntity),
}));

/** Defines the campfire shop item relations relations. */
export const campfireShopItemRelations = relations(campfireShopItem, ({ one }) => ({
  campfire: one(campfire, { fields: [campfireShopItem.campfireId], references: [campfire.id] }),
  item: one(item, { fields: [campfireShopItem.itemId], references: [item.id] }),
}));

/** Defines the chest inventory relations relations. */
export const chestInventoryRelations = relations(chestInventory, ({ one }) => ({
  chest: one(chest, { fields: [chestInventory.chestId], references: [chest.id] }),
  item: one(item, { fields: [chestInventory.itemId], references: [item.id] }),
}));

/** Defines the lobby entity relations relations. */
export const lobbyEntityRelations = relations(lobbyEntity, ({ one }) => ({
  lobby: one(lobby, { fields: [lobbyEntity.lobbyId], references: [lobby.id] }),
  character: one(character, { fields: [lobbyEntity.characterId], references: [character.id] }),
  monster: one(monster, { fields: [lobbyEntity.monsterId], references: [monster.id] }),
  chest: one(chest, { fields: [lobbyEntity.chestId], references: [chest.id] }),
  campfire: one(campfire, { fields: [lobbyEntity.campfireId], references: [campfire.id] }),
}));
