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
import { user } from "./auth";

// prettier-ignore
export const lobby = pgTable("lobby", {
  id:           uuid("id").primaryKey().defaultRandom(),
  name:         text("name").notNull(),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  data:         jsonb("data").notNull().$type<Game.Data>().default({walls:[], sequence:[], turn: -1}),
  masterId:     uuid("master_id").notNull().references(()=> user.id, { onDelete:"cascade" }),
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
export const lobbyEntity = pgTable("lobby_entity", {
  id:           uuid("id").primaryKey().defaultRandom(),
  lobbyId:      uuid("lobby_id").notNull().references(() => lobby.id, { onDelete: "cascade" }),
  type:         text("type", { enum: ["character", "monster"] }).notNull(),
  characterId:  uuid("character_id").references(() => character.id, { onDelete: "cascade" }),
  monsterId:    uuid("monster_id").references(() => monster.id, { onDelete: "cascade" }),
  position:     jsonb("position").notNull().$type<Game.Position>().default({ x: 0, z: 0 }),
  actions:      integer("actions").notNull().default(0),
}, (table) => [
  index("lobby_entity_lobby_idx").on(table.lobbyId),
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

// prettier-ignore
export const monster = pgTable("monster", {
  id:           uuid("id").primaryKey().defaultRandom(),
  name:         text("name").notNull(),
  level:        integer("level").notNull().default(1),
  hp:           integer("hp").notNull().default(10),
  maxHp:        integer("max_hp").notNull().default(10),
  armor:        integer("armor").notNull().default(0),
  stamina:      integer("stamina").notNull().default(5),
  maxActions:   integer("max_actions").notNull().default(1),
  memory:       integer("memory").notNull().default(2),
});
