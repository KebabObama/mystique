import { schema } from "@/lib/schema";
import { BicepsFlexed, Bone, Brain, LucideIcon, Rabbit } from "lucide-react";

export namespace Game {
  // prettier-ignore
  export const ATTRIBUTE_DESCRIPTION: Record<Game.Attribute, string>  = {
    strength:     "Physical might and raw power. Determines how much heavy gear and loot you can carry before becoming encumbered.",
    dexterity:    "Agility, reflexes, and balance. A higher score allows you to traverse the battlefield with greater speed.",
    constitution: "Endurance and vital force. Governs your physical resilience and total health pool.",
    intelligence: "Cognitive capacity and mental storage. Grants 'Memories' — mental tokens required to prepare and manifest spells.",
  } as const;

  export const ATTRIBUTE_ICON: Record<Game.Attribute, LucideIcon> = {
    strength: BicepsFlexed,
    dexterity: Rabbit,
    constitution: Bone,
    intelligence: Brain,
  } as const;

  export const STARTING_RACES: Record<Game.Race, Record<Game.Attribute, number>> = {
    dwarf: { strength: 6, dexterity: 4, constitution: 6, intelligence: 4 },
    elf: { strength: 3, dexterity: 5, constitution: 4, intelligence: 7 },
    human: { strength: 4, dexterity: 7, constitution: 4, intelligence: 5 },
    orc: { strength: 7, dexterity: 4, constitution: 6, intelligence: 3 },
  } as const;

  export const ATTRIBUTES = ["strength", "dexterity", "constitution", "intelligence"] as const;
  export const RACES = ["dwarf", "elf", "human", "orc"] as const;
  export const ITEM_TYPES = ["weapon", "helmet", "armor", "leggings", "ring", "misc"] as const;
  export const EFFECTS = ["corroding", "frostbite", "burning", "shocked"] as const;
  export const PHASES = ["editing", "playing"] as const;
  export const FURNITURE_TYPES = [
    "chest",
    "table",
    "chair",
    "bed",
    "torch",
    "trap",
    "door",
  ] as const;
  export const MONSTER_TYPES = [
    "goblin",
    "skeleton",
    "orc",
    "troll",
    "dragon",
    "spider",
    "rat",
  ] as const;
  export const ROOM_TYPES = [
    "corridor",
    "chamber",
    "treasury",
    "armory",
    "prison",
    "boss",
  ] as const;

  export type Race = (typeof Game.RACES)[number];
  export type Attribute = (typeof Game.ATTRIBUTES)[number];
  export type ItemType = (typeof Game.ITEM_TYPES)[number];
  export type Effect = (typeof Game.EFFECTS)[number];
  export type Phase = (typeof Game.PHASES)[number];
  export type FurnitureType = (typeof Game.FURNITURE_TYPES)[number];
  export type MonsterType = (typeof Game.MONSTER_TYPES)[number];
  export type RoomType = (typeof Game.ROOM_TYPES)[number];

  // Grid position for rooms and entities
  export type Position = { x: number; y: number };

  // Furniture inside rooms (chests, tables, etc.)
  export type Furniture = {
    id: string;
    type: FurnitureType;
    position: Position;
    loot?: string[]; // Item IDs for chests
  };

  // Monster that can be placed in rooms
  export type Monster = {
    id: string;
    type: MonsterType;
    name: string;
    hp: number;
    maxHp: number;
    position: Position;
    attributes: Record<Attribute, number>;
    abilities: Ability[];
  };

  // Room that can be placed on the floor grid
  export type Room = {
    id: string;
    type: RoomType;
    position: Position; // Top-left corner on the grid
    width: number; // In grid cells (always full blocks)
    height: number; // In grid cells (always full blocks)
    furniture: Furniture[];
    monsters: Monster[];
    explored: boolean;
  };

  // Floor containing the dungeon grid
  export type Floor = {
    id: string;
    level: number;
    gridWidth: number;
    gridHeight: number;
    rooms: Room[];
  };

  // World containing all floors
  export type World = { floors: Floor[]; currentFloor: number };

  // Sequence entity - either a character or monster in turn order
  export type SequenceEntity = { id: string; type: "character" | "monster"; name: string };

  // Full game state stored in instance memory
  export type GameState = {
    phase: Phase;
    world: World;
    sequence: SequenceEntity[];
    currentTurn: number;
    characterPositions: Record<string, { floorId: string; position: Position }>;
  };

  // Prebuilt room templates the master can use
  export const ROOM_TEMPLATES: Record<
    RoomType,
    { minWidth: number; maxWidth: number; minHeight: number; maxHeight: number }
  > = {
    corridor: { minWidth: 1, maxWidth: 2, minHeight: 3, maxHeight: 8 },
    chamber: { minWidth: 3, maxWidth: 5, minHeight: 3, maxHeight: 5 },
    treasury: { minWidth: 2, maxWidth: 3, minHeight: 2, maxHeight: 3 },
    armory: { minWidth: 2, maxWidth: 4, minHeight: 2, maxHeight: 4 },
    prison: { minWidth: 2, maxWidth: 3, minHeight: 3, maxHeight: 5 },
    boss: { minWidth: 4, maxWidth: 6, minHeight: 4, maxHeight: 6 },
  } as const;

  // Monster stat templates
  export const MONSTER_STATS: Record<
    MonsterType,
    { hp: number; attributes: Record<Attribute, number> }
  > = {
    rat: { hp: 3, attributes: { strength: 1, dexterity: 6, constitution: 2, intelligence: 1 } },
    goblin: { hp: 6, attributes: { strength: 3, dexterity: 5, constitution: 3, intelligence: 3 } },
    skeleton: {
      hp: 8,
      attributes: { strength: 4, dexterity: 3, constitution: 4, intelligence: 1 },
    },
    spider: { hp: 5, attributes: { strength: 2, dexterity: 7, constitution: 3, intelligence: 2 } },
    orc: { hp: 12, attributes: { strength: 6, dexterity: 3, constitution: 5, intelligence: 2 } },
    troll: { hp: 20, attributes: { strength: 8, dexterity: 2, constitution: 7, intelligence: 1 } },
    dragon: {
      hp: 50,
      attributes: { strength: 10, dexterity: 4, constitution: 10, intelligence: 8 },
    },
  } as const;

  // Create a new empty world
  export const createWorld = (): World => ({ floors: [createFloor(1)], currentFloor: 0 });

  // Create a new floor
  export const createFloor = (level: number): Floor => ({
    id: crypto.randomUUID(),
    level,
    gridWidth: 20,
    gridHeight: 20,
    rooms: [],
  });

  // Create a monster from template
  export const createMonster = (type: MonsterType, position: Position): Monster => {
    const stats = MONSTER_STATS[type];
    return {
      id: crypto.randomUUID(),
      type,
      name: `${type.charAt(0).toUpperCase()}${type.slice(1)}`,
      hp: stats.hp,
      maxHp: stats.hp,
      position,
      attributes: { ...stats.attributes },
      abilities: [],
    };
  };

  // Create a room from template
  export const createRoom = (
    type: RoomType,
    position: Position,
    width: number,
    height: number
  ): Room => ({
    id: crypto.randomUUID(),
    type,
    position,
    width,
    height,
    furniture: [],
    monsters: [],
    explored: false,
  });

  // Initialize game state
  export const createGameState = (): GameState => ({
    phase: "editing",
    world: createWorld(),
    sequence: [],
    currentTurn: 0,
    characterPositions: {},
  });

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

  export type PartialCharacter = typeof schema.character.$inferSelect & {
    inventory: (Omit<typeof schema.inventory.$inferSelect, "itemId" | "characterId"> &
      typeof schema.item.$inferSelect)[];
  };

  export type Character = PartialCharacter & {
    maxHp: number;
    actions: number;
    maxActions: number;
    stamina: number;
    weight: number;
    maxWeight: number;
    maxMemory: number;
    armor: number;
  };

  export const completeCharacter = (c: PartialCharacter): Character => {
    const maxHp = Math.floor(c.attributes.constitution + c.attributes.strength / 2 + 5);
    const actions = Math.floor(
      c.level / 4 + c.attributes.dexterity / 8 + c.attributes.intelligence / 8
    );
    const maxWeight = Math.floor(10 + c.attributes.strength + c.attributes.constitution / 2);
    const maxMemory = Math.floor(c.attributes.intelligence / 2 + c.level + 1);
    const weight = c.inventory.reduce((acc, e) => acc + e.weight, 0);
    const armor = c.inventory.reduce((acc, e) => acc + (e.equipped ? e.armor || 0 : 0), 0);
    const stamina = Math.floor((c.attributes.dexterity / 2 + 5) / (maxWeight < weight ? 2 : 1));
    return {
      ...c,
      maxMemory,
      armor,
      maxHp,
      maxWeight,
      stamina,
      weight,
      actions,
      maxActions: actions,
      memory: Math.min(c.memory, maxMemory),
    } satisfies Character;
  };

  export const generateRandomName = (c: { race: Race }) => {
    const NAME_PREFIXES: Record<Game.Race, string[]> = {
      dwarf: ["Thor", "Brom", "Gim", "Dwa", "Bal", "Krag", "Dum", "Thrain"],
      elf: ["Gala", "Lego", "Ara", "Cele", "Thran", "Elro", "Fea", "Luth"],
      human: ["Ara", "Bran", "Cath", "Dun", "Eri", "Finn", "Gwen", "Hal"],
      orc: ["Grom", "Thrak", "Durg", "Mog", "Grak", "Urg", "Brok", "Skar"],
    };

    const NAME_SUFFIXES: Record<Game.Race, string[]> = {
      dwarf: ["in", "li", "dur", "nar", "rim", "dan", "bur", "rik"],
      elf: ["driel", "las", "wen", "born", "duil", "ion", "nor", "ien"],
      human: ["gorn", "wen", "ric", "ley", "ton", "wyn", "dor", "ian"],
      orc: ["ash", "nak", "ush", "gul", "lok", "tar", "gar", "dak"],
    };
    const prefixes = NAME_PREFIXES[c.race];
    const suffixes = NAME_SUFFIXES[c.race];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + suffix;
  };
}
