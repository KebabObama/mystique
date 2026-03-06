import { schema } from "@/lib/db";
import type { Brand } from ".";

// prettier-ignore
const {
  campfire, campfireShopItem, character, chest, chestInventory, 
  inventory, item, lobby, lobbyEntity, monster, user,
} = schema;

// ----- Primitive Types -----
export type GameRace = "dwarf" | "elf" | "human" | "orc";
export type GameAttribute = "strength" | "dexterity" | "constitution" | "intelligence";
export type GameItemType = "weapon" | "helmet" | "armor" | "leggings" | "ring" | "misc";
export type GameEffect = "corroding" | "frostbite" | "burning" | "shocked";

// ----- Complex Types -----
export type GameAbility = {
  name: string;
  cost: number;
  // Amount of tiles that ability can be used for, zero stands for self
  range: number;
  // Negative amount makes multiple projectiles and positive creates AoE
  targeting: number;
  // Negative amount is healing and positive is damage
  amount: [number, number];
  effects: Record<GameEffect, number>;
};

export type Character = typeof character.$inferSelect & {
  inventory: Array<
    Omit<typeof inventory.$inferSelect, "itemId" | "characterId"> & typeof item.$inferSelect
  >;
};

export type Monster = typeof monster.$inferSelect;

export type Chest = typeof chest.$inferSelect & {
  inventory: Array<
    Omit<typeof chestInventory.$inferSelect, "itemId" | "chestId"> & typeof item.$inferSelect
  >;
};

export type Campfire = typeof campfire.$inferSelect & {
  shopItems: Array<
    Omit<typeof campfireShopItem.$inferSelect, "itemId" | "campfireId"> & typeof item.$inferSelect
  >;
};

type BaseEntity = Omit<
  typeof lobbyEntity.$inferSelect,
  "characterId" | "monsterId" | "chestId" | "campfireId" | "lobbyId"
>;

export type CharacterEntity = BaseEntity & Character & { type: "character" };
export type MonsterEntity = BaseEntity & Monster & { type: "monster" };
export type ChestEntity = BaseEntity & Chest & { type: "chest" };
export type CampfireEntity = BaseEntity & BaseEntity & { type: "campfire" };

export type Entity = CharacterEntity | MonsterEntity | ChestEntity | CampfireEntity;

export type Instance = typeof lobby.$inferSelect & {
  members: Array<typeof user.$inferSelect>;
  characters: Array<CharacterEntity>;
  monsters: Array<MonsterEntity>;
  chests: Array<ChestEntity>;
  campfires: Array<CampfireEntity>;
};

export type Position = { x: number; z: number };

export type GameData = {
  walls: Array<Position>;
  sequence: Array<Brand<string, "lobbyEntityId">>;
  turn: number;
};

export type CombatEntity = Extract<Entity, { type: "character" | "monster" }>;
