import { Game } from "@/lib/game";
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
import { user } from "./auth-schema";

// prettier-ignore
export const lobby = pgTable("lobby", {
  id:           uuid("id").primaryKey().defaultRandom(),
  name:         text("name").notNull(),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  game:         jsonb("game").notNull().$type<Game.Data>().default({walls:[], positions:{}}),
  sequence:     uuid("sequence").array().notNull().default([]),
  masterId:     uuid("master_id").notNull().references(()=> user.id, { onDelete:"cascade" }),
  turn:         integer("turn").notNull().default(0),
});

// prettier-ignore
export const lobbyMember = pgTable("lobby_member", {
  lobbyId:    uuid("lobby_id").notNull().references(() => lobby.id, { onDelete: "cascade" }),
  userId:     uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  lastSeen:   timestamp("last_seen").notNull().defaultNow().$onUpdate(() => new Date()).notNull(),
  }, (table) => [
    primaryKey({ name: "lobby_member_pk", columns: [table.lobbyId, table.userId] }), 
    index("member_user_idx").on(table.userId),
]);

// prettier-ignore
export const message = pgTable("message", {
    id:       uuid("id").primaryKey().defaultRandom(),
    lobbyId:  uuid("lobby_id").notNull().references(() => lobby.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    content:  text("content").notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull(),
  }, (table) => [
    index("message_lobby_idx").on(table.lobbyId)
]);

// prettier-ignore
export const lobbyCharacter = pgTable("lobby_character", {
  characterId:uuid("character_id").notNull().references(() => character.id, { onDelete: "cascade" }),
  lobbyId:    uuid("item_id").notNull().references(() => lobby.id, { onDelete: "cascade" }),
}, (table) => [
  index("lobby_character_idx").on(table.characterId),
  primaryKey({ name: "lobby_character_pk", columns: [table.characterId, table.lobbyId] }),
]);

// prettier-ignore
export const item = pgTable("item", {
  id:         uuid("id").primaryKey().defaultRandom(),
  name:       text("name").notNull().unique(),
  type:       text("type", { enum: Game.ITEM_TYPES }).notNull().default("misc"),
  value:      integer("value").notNull().default(0),
  weight:     integer("weight").notNull().default(0),
  armor:      integer("armor"),
  abilities:  json("abilities").notNull().$type<Game.Ability[]>(),
  requiremnts:json("regiments").notNull().$type<Partial<Record<Game.Attribute, number | null>>>().default({}),
});

// prettier-ignore
export const character = pgTable("character", {
  id:           uuid("id").primaryKey().defaultRandom(),
  ownerId:      uuid("owner_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name:         text("name").notNull(),
  race:         text("race", { enum: Game.RACES }).notNull(),
  level:        integer("level").notNull().default(1),
  xp:           integer("xp").notNull().default(0),
  attributes:   jsonb("attributes").notNull().$type<Record<Game.Attribute, number>>(),
  memory:       integer("memory").notNull().default(2),
  hp:           integer("hp").notNull().default(10),
  coins:        integer("coins").notNull().default(0),
  maxHp:        integer("max_hp").notNull().default(10),
  actions:      integer("actions").notNull().default(0),
  maxActions:   integer("max_actions").notNull().default(0),
  stamina:      integer("stamina").notNull().default(5),
  weight:       integer("weight").notNull().default(0),
  maxWeight:    integer("max_weight").notNull().default(10),
  maxMemory:    integer("max_memory").notNull().default(2),
  armor:        integer("armor").notNull().default(0),
}, (table) => [
  index("character_owner_idx").on(table.ownerId),
]);

// prettier-ignore
export const inventory = pgTable("inventory", {
  characterId:uuid("character_id").notNull().references(() => character.id, { onDelete: "cascade" }),
  itemId:     uuid("item_id").notNull().references(() => item.id, { onDelete: "cascade" }),
  quantity:   integer("quantity").notNull().default(1),
  equipped:   boolean("equipped").notNull().default(false),
}, (table) => [
  index("inventory_char_idx").on(table.characterId),
  primaryKey({ name: "inventory_pk", columns: [table.characterId, table.itemId] }),
]);
