import { Game } from "@/lib/game";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { lobby } from "./social-schema";

// prettier-ignore
export const ability = pgTable("ability", {
  id:               uuid("id").primaryKey().defaultRandom(),
  name:             text("name").notNull().unique(),
  cost:             integer("cost").notNull().default(0),
  rolls:            integer("rolls").array().notNull().default([]),
  effects:          jsonb("effects").notNull().$type<Partial<Record<Game.Effect, number>>>().default({}),
});

// prettier-ignore
export const item = pgTable("item", {
  id:               uuid("id").primaryKey().defaultRandom(),
  name:             text("name").notNull().unique(),
  type:             text("type", { enum: Game.KEYS.ITEM_TYPES }).notNull().default("misc"),
  value:            integer("value").notNull().default(0),
  weight:           integer("weight").notNull().default(0),
  armor:            integer("armor"),
});

// prettier-ignore
export const itemToAbility = pgTable("item_to_ability", {
  abilityId:      uuid("ability_id").notNull().references(() => ability.id, { onDelete: "cascade" }),
  itemId:         uuid("item_id").notNull().references(() => item.id, { onDelete: "cascade" }),
}, (table) => [
  primaryKey({ columns: [table.abilityId, table.itemId] }),
]);

// prettier-ignore
export const character = pgTable("character", {
  id:             uuid("id").primaryKey().defaultRandom(),
  ownerId:        uuid("owner_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name:           text("name").notNull(),
  race:           text("race", { enum: Game.KEYS.RACES}).notNull(),
  level:          integer("level").notNull().default(1),
  xp:             integer("xp").notNull().default(0),
  attributes:     jsonb("attributes").notNull().$type<Record<Game.Attribute, number>>(),
  hp:             integer("hp").notNull().default(10),
}, (table) => [
  index("character_owner_idx").on(table.ownerId),
]);

// prettier-ignore
export const inventory = pgTable("inventory", {
  characterId:    uuid("character_id").notNull().references(() => character.id, { onDelete: "cascade" }),
  itemId:         uuid("item_id").notNull().references(() => item.id, { onDelete: "cascade" }),
  quantity:       integer("quantity").notNull().default(1),
  equipped:       boolean("equipped").notNull().default(false),
}, (table) => [
  index("inventory_char_idx").on(table.characterId),
  primaryKey({ columns: [table.characterId, table.itemId] }),
]);

// prettier-ignore
export const object = pgTable("object", {
  id:             uuid("id").primaryKey().defaultRandom(),
  gameInstanceId: uuid("game_id").notNull().references(() => gameInstance.id, { onDelete: "cascade" }),
  data:           jsonb("data").notNull().$type<{ position: [number, number, number]; size: [number, number, number]; gltf?: string }>(),
  characterId:    uuid("game_id").references(() => character.id, { onDelete: "cascade" }),
}, (table) => [
  index("object_game_idx").on(table.gameInstanceId),
]);

// prettier-ignore
export const storage = pgTable("storage", {
  objectId:       uuid("game_id").notNull().references(() => gameInstance.id, { onDelete: "cascade" }),
  itemId:         uuid("item_id").notNull().references(() => item.id, { onDelete: "cascade" }),
  quantity:       integer("quantity").notNull().default(1),
}, (table) => [
  index("storage_object_idx").on(table.objectId),
  primaryKey({ columns: [table.objectId, table.itemId] }),

]);

// prettier-ignore
export const gameInstance = pgTable("game_instance", {
  id:             uuid("id").primaryKey().defaultRandom(),
  lobbyId:        uuid("lobby_id").notNull().unique().references(() => lobby.id, { onDelete: "cascade" }),
  state:          text("state", { enum: ["waiting", "active", "ended"] }).notNull().default("waiting"),
  createdAt:      timestamp("created_at").defaultNow().notNull(),
});

// prettier-ignore
export const gameCharacters = pgTable("game_characters", {
  gameInstanceId: uuid("game_instance_id").notNull().references(() => gameInstance.id, { onDelete: "cascade" }),
  characterId:    uuid("character_id").notNull().references(() => character.id, { onDelete: "cascade" }),
}, (table) => [
  primaryKey({ columns: [table.gameInstanceId, table.characterId] }),
]);

