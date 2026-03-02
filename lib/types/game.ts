import {
  campfire,
  campfireShopItem,
  character,
  chest,
  chestInventory,
  inventory,
  item,
  lobby,
  lobbyEntity,
  monster,
  user,
} from "@/db/schema";

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

export type GameCharacter = typeof character.$inferSelect & {
  inventory: Array<
    Omit<typeof inventory.$inferSelect, "itemId" | "characterId"> & {
      item: typeof item.$inferSelect;
    }
  >;
};

export type GameMonster = typeof monster.$inferSelect;

export type GameChest = typeof chest.$inferSelect & {
  inventory: Array<
    Omit<typeof chestInventory.$inferSelect, "itemId" | "chestId"> & {
      item: typeof item.$inferSelect;
    }
  >;
};

export type GameCampfire = typeof campfire.$inferSelect & {
  shopItems: Array<
    Omit<typeof campfireShopItem.$inferSelect, "itemId" | "campfireId"> & {
      item: typeof item.$inferSelect;
    }
  >;
};

export type GameEntity = Omit<
  typeof lobbyEntity.$inferSelect,
  "characterId" | "monsterId" | "chestId" | "campfireId" | "lobbyId"
> &
  (
    | { type: "character"; playable: GameCharacter }
    | { type: "monster"; playable: GameMonster }
    | { type: "chest"; playable: GameChest }
    | { type: "campfire"; playable: GameCampfire }
  );

export type GameCharacterEntity = Extract<GameEntity, { type: "character" }>;
export type GameMonsterEntity = Extract<GameEntity, { type: "monster" }>;
export type GameChestEntity = Extract<GameEntity, { type: "chest" }>;
export type GameCampfireEntity = Extract<GameEntity, { type: "campfire" }>;

export type GameInstance = typeof lobby.$inferSelect & {
  members: Array<typeof user.$inferSelect>;
  characters: Array<GameCharacterEntity>;
  monsters: Array<GameMonsterEntity>;
  chests: Array<GameChestEntity>;
  campfires: Array<GameCampfireEntity>;
  entities: Array<GameEntity>;
};

export type GamePosition = { x: number; z: number };

export type GameData = { walls: Array<GamePosition>; sequence: Array<string>; turn: number };

export type GameCombatEntity = Extract<GameEntity, { type: "character" | "monster" }>;
