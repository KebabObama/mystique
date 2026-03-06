import * as schema from "@/db/schema";
import { BicepsFlexed, Bone, Brain, LucideIcon, Rabbit } from "lucide-react";
import type { Brand } from ".";

export const ATTRIBUTE_DESCRIPTION: Record<Attribute, string> = {
  strength:
    "Physical might and raw power. Determines how much heavy gear and loot you can carry before becoming encumbered.",
  dexterity:
    "Agility, reflexes, and balance. A higher score allows you to traverse the battlefield with greater speed.",
  constitution:
    "Endurance and vital force. Governs your physical resilience and total health pool.",
  intelligence:
    "Cognitive capacity and mental storage. Grants 'Memories' — mental tokens required to prepare and manifest spells.",
} as const;

export const ATTRIBUTE_ICON: Record<Attribute, LucideIcon> = {
  strength: BicepsFlexed,
  dexterity: Rabbit,
  constitution: Bone,
  intelligence: Brain,
} as const;

export const STARTING_RACES: Record<Race, Record<Attribute, number>> = {
  dwarf: { strength: 6, dexterity: 4, constitution: 6, intelligence: 4 },
  elf: { strength: 3, dexterity: 5, constitution: 4, intelligence: 7 },
  human: { strength: 4, dexterity: 7, constitution: 4, intelligence: 5 },
  orc: { strength: 7, dexterity: 4, constitution: 6, intelligence: 3 },
} as const;

export const ATTRIBUTES = ["strength", "dexterity", "constitution", "intelligence"] as const;
export const RACES = ["dwarf", "elf", "human", "orc"] as const;
export const ITEM_TYPES = ["weapon", "helmet", "armor", "leggings", "ring", "misc"] as const;
export const EFFECTS = ["corroding", "frostbite", "burning", "shocked"] as const;

export const EMPTY_EFFECTS: Record<Effect, number> = {
  corroding: 0,
  frostbite: 0,
  burning: 0,
  shocked: 0,
} as const;
// prettier-ignore
const {
  campfire, campfireShopItem, character, chest, chestInventory, 
  inventory, item, lobby, lobbyEntity, monster, user,
} = schema;

// ----- Primitive Types -----
export type Race = "dwarf" | "elf" | "human" | "orc";
export type Attribute = "strength" | "dexterity" | "constitution" | "intelligence";
export type ItemType = "weapon" | "helmet" | "armor" | "leggings" | "ring" | "misc";
export type Effect = "corroding" | "frostbite" | "burning" | "shocked";

// ----- Complex Types -----
export type Ability = {
  name: string;
  cost: number;
  // Amount of tiles that ability can be used for, zero stands for self
  range: number;
  // Negative amount makes multiple projectiles and positive creates AoE
  targeting: number;
  // Negative amount is healing and positive is damage
  amount: [number, number];
  effects: Record<Effect, number>;
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

export type Data = {
  walls: Array<Position>;
  sequence: Array<Brand<string, "lobbyEntityId">>;
  turn: number;
};

export type CombatEntity = Extract<Entity, { type: "character" | "monster" }>;
