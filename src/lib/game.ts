import type * as schema from "@/db/schema";

type InventoryEntry = Omit<typeof schema.inventory.$inferSelect, "itemId" | "characterId"> &
  typeof schema.item.$inferSelect;
type ChestInventoryEntry = Omit<typeof schema.chestInventory.$inferSelect, "itemId" | "chestId"> &
  typeof schema.item.$inferSelect;
type CampfireShopEntry = Omit<
  typeof schema.campfireShopItem.$inferSelect,
  "itemId" | "campfireId"
> &
  typeof schema.item.$inferSelect;

type LobbyEntityRow = typeof schema.lobbyEntity.$inferSelect;
type BaseEntity = Omit<
  LobbyEntityRow,
  "characterId" | "monsterId" | "chestId" | "campfireId" | "lobbyId"
>;

/** Provides the Game namespace. */
export namespace Game {
    /** Represents the brand type. */
export type Brand<K, T> = K & { readonly __brand?: T };

    /** Defines the attributes constant. */
export const ATTRIBUTES = ["strength", "dexterity", "constitution", "intelligence"] as const;
    /** Defines the races constant. */
export const RACES = ["dwarf", "elf", "human", "orc"] as const;
    /** Defines the item types constant. */
export const ITEM_TYPES = ["weapon", "helmet", "armor", "leggings", "ring", "misc"] as const;
    /** Defines the effects constant. */
export const EFFECTS = ["corroding", "frostbite", "burning", "shocked"] as const;
    /** Defines the entity types constant. */
export const ENTITY_TYPES = ["character", "monster", "chest", "campfire"] as const;

    /** Represents the attribute type. */
export type Attribute = (typeof ATTRIBUTES)[number];
    /** Represents the race type. */
export type Race = (typeof RACES)[number];
    /** Represents the item type type. */
export type ItemType = (typeof ITEM_TYPES)[number];
    /** Represents the effect type. */
export type Effect = (typeof EFFECTS)[number];
    /** Represents the entity type type. */
export type EntityType = (typeof ENTITY_TYPES)[number];

    /** Represents the position type. */
export type Position = { x: number; z: number };
    /** Represents the ability type. */
export type Ability = {
    name: string;
    cost: number;
    range: number;
    targeting: number;
    amount: [number, number];
    effects: Record<Effect, number>;
  };

    /** Represents the data type. */
export type Data = {
    walls: Array<Position>;
    sequence: Array<Brand<string, "lobbyEntityId">>;
    turn: number;
  };

    /** Defines the initial data constant. */
export const INITIAL_DATA: Data = { walls: [], sequence: [], turn: -1 };

    /** Defines the empty effects constant. */
export const EMPTY_EFFECTS: Record<Effect, number> = {
    corroding: 0,
    frostbite: 0,
    burning: 0,
    shocked: 0,
  };

    /** Defines the attribute description constant. */
export const ATTRIBUTE_DESCRIPTION: Record<Attribute, string> = {
    strength:
      "Physical might and raw power. Determines how much heavy gear and loot you can carry before becoming encumbered.",
    dexterity:
      "Agility, reflexes, and balance. A higher score allows you to traverse the battlefield with greater speed.",
    constitution:
      "Endurance and vital force. Governs your physical resilience and total health pool.",
    intelligence:
      "Cognitive capacity and mental storage. Grants 'Memories' — mental tokens required to prepare and manifest spells.",
  };

    /** Defines the starting races constant. */
export const STARTING_RACES: Record<Race, Record<Attribute, number>> = {
    dwarf: { strength: 6, dexterity: 4, constitution: 6, intelligence: 4 },
    elf: { strength: 3, dexterity: 5, constitution: 4, intelligence: 7 },
    human: { strength: 4, dexterity: 7, constitution: 4, intelligence: 5 },
    orc: { strength: 7, dexterity: 4, constitution: 6, intelligence: 3 },
  };

    /** Represents the character type. */
export type Character = typeof schema.character.$inferSelect & { inventory: Array<InventoryEntry> };
    /** Represents the monster type. */
export type Monster = typeof schema.monster.$inferSelect;
    /** Represents the chest type. */
export type Chest = typeof schema.chest.$inferSelect & { inventory: Array<ChestInventoryEntry> };
    /** Represents the campfire type. */
export type Campfire = typeof schema.campfire.$inferSelect & { shopItems: Array<CampfireShopEntry> };

    /** Represents the character entity type. */
export type CharacterEntity = BaseEntity &
    Omit<Character, "id"> & {
      id: LobbyEntityRow["id"];
      characterId: (typeof schema.character.$inferSelect)["id"];
      type: "character";
    };

    /** Represents the monster entity type. */
export type MonsterEntity = BaseEntity &
    Omit<Monster, "id"> & {
      id: LobbyEntityRow["id"];
      monsterId: (typeof schema.monster.$inferSelect)["id"];
      type: "monster";
    };

    /** Represents the chest entity type. */
export type ChestEntity = BaseEntity &
    Omit<Chest, "id"> & {
      id: LobbyEntityRow["id"];
      chestId: (typeof schema.chest.$inferSelect)["id"];
      type: "chest";
    };

    /** Represents the campfire entity type. */
export type CampfireEntity = BaseEntity &
    Omit<Campfire, "id"> & {
      id: LobbyEntityRow["id"];
      campfireId: (typeof schema.campfire.$inferSelect)["id"];
      type: "campfire";
    };

    /** Represents the entity type. */
export type Entity = CharacterEntity | MonsterEntity | ChestEntity | CampfireEntity;

    /** Represents the instance type. */
export type Instance = Omit<typeof schema.lobby.$inferSelect, "data"> & {
    data: Data;
    members: Array<typeof schema.user.$inferSelect>;
    characters: Array<CharacterEntity>;
    monsters: Array<MonsterEntity>;
    chests: Array<ChestEntity>;
    campfires: Array<CampfireEntity>;
  };

    /** Represents the entity patch type. */
export type EntityPatch<T extends { id: string }> = { upsert?: Array<T>; remove?: Array<T["id"]> };

    /** Represents the state patch type. */
export type StatePatch = {
    data?: Partial<Data>;
    members?: Instance["members"];
    characters?: EntityPatch<CharacterEntity>;
    monsters?: EntityPatch<MonsterEntity>;
    chests?: EntityPatch<ChestEntity>;
    campfires?: EntityPatch<CampfireEntity>;
  };

    /** Represents the state sync type. */
export type StateSync = { type: "full"; instance: Instance } | { type: "patch"; patch: StatePatch };
    /** Represents the combat entity type. */
export type CombatEntity = Extract<Entity, { type: "character" | "monster" }>;
}