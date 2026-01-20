import { Game } from "@/lib/game";
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  jsonb,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { lobby } from "./social-schema";

/* ============================================================
  ITEMS
============================================================ */

// prettier-ignore
export const item = pgTable("item", {
  id:               uuid("id").primaryKey().defaultRandom(),
  name:             text("name").notNull().unique(),
  type:             text("type", { enum: Game.KEYS.ITEM_TYPES }).notNull().default("misc"),
  value:            integer("value").notNull().default(0),
  weight:           integer("weight").notNull().default(0),
  armor:            integer("armor"),
  abilities:        json("abilities").notNull().$type<Game.Ability[]>(),
  requiremnts:      json("regiments").notNull().$type<Partial<Record<Game.Attribute, number | null>>>().default({}),
});

/* ============================================================
  CHARACTERS
============================================================ */

// prettier-ignore
export const character = pgTable("character", {
  id:         uuid("id").primaryKey().defaultRandom(),
  ownerId:    uuid("owner_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name:       text("name").notNull(),
  race:       text("race", { enum: Game.KEYS.RACES }).notNull(),
  level:      integer("level").notNull().default(1),
  xp:         integer("xp").notNull().default(0),
  attributes: jsonb("attributes").notNull().$type<Record<Game.Attribute, number>>(),
  memory:     integer("memory").notNull().default(2),
  hp:         integer("hp").notNull().default(10),
  coins:      integer("coins").notNull().default(0),
}, (table) => [
  index("character_owner_idx").on(table.ownerId),
]);

/* ============================================================
  CHARACTER INVENTORY
============================================================ */

// prettier-ignore
export const inventory = pgTable("inventory", {
  characterId: uuid("character_id").notNull().references(() => character.id, { onDelete: "cascade" }),
  itemId:      uuid("item_id").notNull().references(() => item.id, { onDelete: "cascade" }),
  quantity:    integer("quantity").notNull().default(1),
  equipped:    boolean("equipped").notNull().default(false),
}, (table) => [
  index("inventory_char_idx").on(table.characterId),
  primaryKey({ name: "inventory_pk", columns: [table.characterId, table.itemId] }),
]);

/* ============================================================
  GAME INSTANCE
============================================================ */

// prettier-ignore
export const instance = pgTable("instance", {
  id:       uuid("id").primaryKey().defaultRandom(),
  lobbyId:  uuid("lobby_id").notNull().references(() => lobby.id, { onDelete: "cascade" }),
  sequence: uuid("sequence").array().notNull().default(sql`ARRAY[]::uuid[]`),
  data:     jsonb("data").notNull().default({}),
  masterId: uuid("master_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

/* ============================================================
  WORLD ENTITY
============================================================ */

// prettier-ignore
export const entity = pgTable("entity", {
  id:         uuid("id").primaryKey().defaultRandom(),
  instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  kind:       text("kind", { enum: ["character","monster","wall","decoration","container","corpse","prop",]}).notNull(),

  position:   jsonb("position").notNull().$type<[number, number, number]>(),
  rotation:   jsonb("rotation").notNull().$type<[number, number, number]>().default([0, 0, 0]),
  scale:      jsonb("scale").notNull().$type<[number, number, number]>().default([1, 1, 1]),

  gltf:       text("gltf"),
  metadata:   jsonb("metadata").notNull().default({}),

  alive:    boolean("alive").notNull().default(true),
}, (table) => [
  index("entity_instance_idx").on(table.instanceId),
  index("entity_kind_idx").on(table.kind),
]);

/* ============================================================
  CHARACTER ↔ ENTITY BINDING
============================================================ */

// prettier-ignore
export const characterEntity = pgTable("character_entity", {
  characterId:  uuid("character_id").notNull().references(() => character.id, { onDelete: "cascade" }),
  entityId:     uuid("entity_id").notNull().references(() => entity.id, { onDelete: "cascade" }),
}, (table) => [
  primaryKey({ name:"character_entity_pk", columns: [table.characterId] }),
  index("char_entity_entity_idx").on(table.entityId),
]);

/* ============================================================
  MONSTERS
============================================================ */

// prettier-ignore
export const monster = pgTable("monster", {
  entityId:   uuid("entity_id").primaryKey().references(() => entity.id, { onDelete: "cascade" }),
  name:       text("name").notNull(),
  level:      integer("level").notNull().default(1),
  hp:         integer("hp").notNull(),
  armor:      integer("armor").notNull().default(0),
  actions:    integer("actions").notNull().default(1),
  memory:     integer("memory").notNull().default(1),
  abilities:  jsonb("abilities").notNull().$type<Game.Ability[]>(),
});

/* ============================================================
  STORAGE
============================================================ */

// prettier-ignore
export const storage = pgTable("storage", {
  entityId: uuid("entity_id").notNull().references(() => entity.id, { onDelete: "cascade" }),
  itemId:   uuid("item_id").notNull().references(() => item.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
}, (table) => [
  index("storage_entity_idx").on(table.entityId),
  primaryKey({ name: "storage_pk", columns: [table.entityId, table.itemId] }),  
]);
