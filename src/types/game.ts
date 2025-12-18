import { Axe, BookAudio, BowArrow, Cross, Flame, Guitar, type LucideIcon } from "lucide-react";

/**
 * @corroding       [{@link ELEMENTS acid}] Remove all resistances other than acid per stack
 * @frostbite       [{@link ELEMENTS cold}] Removes half a tile per stack (Rounded up)
 * @burning         [{@link ELEMENTS fire}] Deals damage equal to half stacks
 * @shocked         [{@link ELEMENTS lightning}] Decreases damage by half of the stacks (Rounded up)
 * @bleeding        [{@link ELEMENTS physical}] Deals 1 dmg each turn and each tile entity moves
 * @toxin           [{@link ELEMENTS poison}] Deals damage equal to current health divided by stacks
 * @smitten         [{@link ELEMENTS radiant}] Decreases caused effects per stack
 * @hastened        Adds 1 action
 * @fortified       Reduces incoming damage per stack
 * @weakened        Increases incoming damage per stack
 * @regenerating    Heals HP per stack
 * @energized       Restores 1 resource
 * @enraged         Doubles damage dealt
 * @focused         Doubles hit chance
 * @confused        Halves hit chance
 * @fastened        Doubles movement speed
 * @slowed          Halves movement speed
 * @stunned         Removes all actions
 */
export const EFFECTS = {
  corroding: { description: "" },
  frostbite: { description: "" },
  burning: { description: "" },
  shocked: { description: "" },
  bleeding: { description: "" },
  toxin: { description: "" },
  smitten: { description: "" },
  hastened: { description: "" },
  fortified: { description: "" },
  weakened: { description: "" },
  regenerating: { description: "" },
  energized: { description: "" },
  shielded: { description: "" },
  enraged: { description: "" },
  focused: { description: "" },
  confused: { description: "" },
  fastened: { description: "" },
  slowed: { description: "" },
  stunned: { description: "" },
} as const satisfies Record<string, { description: string }>;

export type Effect = keyof typeof EFFECTS;

export type Roll = [rolls: number, dice: number, bonus?: number];
export type Vec = [x: number, y: number, z: number];

export const ATTRIBUTES = {
  str: {
    name: "Strength",
    description: "Physical power and athletic prowess. Affects melee attacks and carrying capacity.",
  },
  dex: {
    name: "Dexterity",
    description: "Agility, reflexes, and balance. Influences armor class, initiative, and ranged attacks.",
  },
  con: {
    name: "Constitution",
    description: "Endurance and stamina. Determines hit points and resistance to physical hardship.",
  },
  int: {
    name: "Intelligence",
    description: "Reasoning and memory. Governs arcane spellcasting and knowledge skills.",
  },
  wis: {
    name: "Wisdom",
    description: "Awareness and insight. Powers divine magic and perception abilities.",
  },
  cha: {
    name: "Charisma",
    description: "Force of personality and leadership. Affects social interactions and certain spells.",
  },
} as const satisfies Record<string, { name: string; description: string }>;
export type Attribute = keyof typeof ATTRIBUTES;
export type Attributes = Record<Attribute, number>;

export const ITEM_TYPES = [
  "one-hand",
  "two-hand",
  "consumable",
  "helmet",
  "armor",
  "gloves",
  "leggings",
  "boots",
  "currency",
  "misc",
] as const;

export type Item = {
  name: string;
  type: (typeof ITEM_TYPES)[number];
  abilities: string[];
  effects: [effect: Effect, amount: number][];
  resistances: [element: Element, amount: number][];
  weight: number;
  value: number;
};

export type InventoryItem = Item & {
  equipped?: string;
  quantity: number;
};

export type Inventory = InventoryItem[];

export type Equipment = {
  helmet?: string;
  armor?: string;
  gloves?: string;
  leggings?: string;
  boots?: string;
  left?: string;
  right?: string;
};

export type Ability = {
  name: string;
  modifier?: Attribute;
  concentration?: number;
  cost: number;
  targeting:
    | [type: "self"]
    | [type: "melee", multi?: number]
    | [type: "cone", length: number]
    | [type: "aoe", length: number, size: number]
    | [type: "ranged", length: number, multi?: number];
  effects: [effect: Effect, amount: number][];
  damage: [element: Element, ...Roll][];
};

export type LearnedAbility = {
  id: string;
  name: string;
  modifier?: Attribute;
  concentration?: number;
  cost: number;
  targeting:
    | [type: "self"]
    | [type: "melee", multi?: number]
    | [type: "cone", length: number]
    | [type: "aoe", length: number, size: number]
    | [type: "ranged", length: number, multi?: number];
  effects: Effect[];
  damage: [element: Element, ...Roll][];
} & (
  | { type: "character" }
  | {
      type: "item";
      cooldown: number | "consumable" | "once-per-rest" | "wait-until-rest";
      item: string;
    }
);

export const CLASSES = {
  barbarian: {
    icon: Axe,
    description: "Barbarians are fierce warriors who rely on rage to fuel their attacks and resist damage.",
    resource: { name: "rage", first: 1, levelUp: 1 },
    attribute: "str",
    hp: 10,
  },
  bard: {
    icon: Guitar,
    description: "Bards inspire allies with music and magic, using inspiration to enhance their and others' abilities.",
    resource: { name: "inspiration", first: 2, levelUp: 1 },
    attribute: "cha",
    hp: 8,
  },
  cleric: {
    icon: Cross,
    description: "Clerics channel divine power to heal allies and smite foes, drawing strength from their faith.",
    resource: { name: "faith", first: 2, levelUp: 2 },
    attribute: "wis",
    hp: 6,
  },
  ranger: {
    icon: BowArrow,
    description: "Rangers are skilled hunters and trackers, marking their targets and striking with precision.",
    resource: { name: "mark", first: 3, levelUp: 3 },
    attribute: "dex",
    hp: 8,
  },
  warlock: {
    icon: Flame,
    description:
      "Warlocks wield dark connections with otherworldly entities, using their pact to cast powerful spells.",
    resource: { name: "pact", first: 1, levelUp: 2 },
    attribute: "con",
    hp: 10,
  },
  wizard: {
    icon: BookAudio,
    description: "Wizards study arcane secrets and rely on memory to cast spells with precision and versatility.",
    resource: { name: "memory", first: 4, levelUp: 3 },
    attribute: "int",
    hp: 6,
  },
} as const satisfies Record<
  string,
  {
    icon: LucideIcon;
    description: string;
    resource: { name: string; first: number; levelUp: number };
    attribute: Attribute;
    hp: number;
  }
>;
export type Class = keyof typeof CLASSES;

/**
 * @acid {@link EFFECTS corroding}
 * @cold {@link EFFECTS frostbite}
 * @fire {@link EFFECTS burning}
 * @lightning {@link EFFECTS shocked}
 * @physical {@link EFFECTS bleeding}
 * @poison {@link EFFECTS toxin}
 * @radiant {@link EFFECTS smitten}
 */
export const ELEMENTS = ["acid", "cold", "fire", "lightning", "physical", "poison", "radiant"] as const;
export type Element = (typeof ELEMENTS)[number];

export const RACES = {
  dragonborn: {
    description: "Dragonborn are proud draconic humanoids, often seeking honor and glory.",
    bonuses: { str: 1, dex: -1, con: 1, int: 0, wis: 1, cha: -2 },
    stamina: -1,
  },
  dwarf: {
    description: "Dwarves are sturdy and resilient, skilled in crafting, mining, and combat.",
    bonuses: { str: 1, dex: -2, con: 2, int: 0, wis: 0, cha: -1 },
    stamina: -2,
  },
  elf: {
    description: "Elves are graceful and long-lived, attuned to nature and magic, excelling in agility and perception.",
    bonuses: { str: -3, dex: 3, con: -3, int: 1, wis: 1, cha: 1 },
    stamina: 2,
  },
  human: {
    description: "Humans are versatile and ambitious, able to adapt to any situation and excel.",
    bonuses: { str: -1, dex: 1, con: 0, int: -1, wis: -1, cha: 2 },
    stamina: 2,
  },
  orc: {
    description: "Orcs are fierce warriors with strong physical abilities, often driven by strength and survival.",
    bonuses: { str: 5, dex: -2, con: 3, int: -2, wis: -2, cha: -2 },
    stamina: -2,
  },
  tiefling: {
    description: "Tieflings are descended from fiends, possessing innate magical abilities and often facing prejudice.",
    bonuses: { str: 1, dex: 1, con: 1, int: 0, wis: -2, cha: -1 },
    stamina: 0,
  },
} as const satisfies Record<string, { description: string; bonuses: Record<Attribute, number>; stamina: number }>;
export type Race = keyof typeof RACES;

export type Object = {
  id: string;
  owner: string;
  position: Vec;
  size: Vec;
  model?: string;
};

export type Character = {
  name: string;
  level: number;
  class: Class;
  race: Race;
  effects: Record<Effect, number>;
  attributes: Attributes;
  health: [current: number, max: number];
  stamina: [current: number, max: number];
  actions: [current: number, max: number];
  resource: [current: number, max: number];
  weight: [current: number, max: number];
  resistances: Record<Element, number>;
  inventory: InventoryItem[];
  abilities: LearnedAbility[];
  equipment: Equipment;
};

export type NPC = {
  name: string;
  effects: Record<Effect, number>;
  attributes: Record<Attribute, number>;
  health: [current: number, max: number];
  stamina: [current: number, max: number];
  actions: [current: number, max: number];
  resource: [current: number, max: number];
  resistances: Record<Element, number>;
  inventory: InventoryItem[];
  abilities: LearnedAbility[];
  equipment: Equipment;
};

export type Playable = (Character | NPC) & Object;

export type Game = {
  id: string;
  objects: Object[];
  playable: Playable[];
  sequence: { current: string; order: string[] };
  dm: string;
};
