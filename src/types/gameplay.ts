import { UUID } from "node:crypto";

export namespace Attributes {
  export const keys = ["str", "dex", "con", "int", "wis"] as const;
  export type Type = (typeof keys)[number];
  export const info = {
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
      description: "Reasoning and memory. Governs arcane spell casting and knowledge skills.",
    },
    wis: {
      name: "Wisdom",
      description: "Awareness and insight. Powers divine magic and perception abilities.",
    },
  } as const satisfies Record<Type, { name: string; description: string }>;
}

export namespace Elements {
  export const keys = ["acid", "cold", "fire", "holy", "lightning", "physical", "poison"] as const;
  export type Type = (typeof keys)[number];
}

export namespace Races {
  export const keys = ["dragonborn", "dwarf", "elf", "human", "orc"] as const;
  export type Type = (typeof keys)[number];
  export const info = {
    dragonborn: {
      bonuses: { str: 1, dex: -1, con: 1, int: 0, wis: 1 },
      description: "Dragonborn are proud draconic humanoids, often seeking honor and glory.",
    },
    dwarf: {
      bonuses: { str: 1, dex: -2, con: 2, int: 0, wis: 0 },
      description: "Dwarves are sturdy and resilient, skilled in crafting, mining, and combat.",
    },
    elf: {
      bonuses: { str: -3, dex: 3, con: -3, int: 1, wis: 1 },
      description:
        "Elves are graceful and long-lived, attuned to nature and magic, excelling in agility and perception.",
    },
    human: {
      bonuses: { str: -1, dex: 1, con: 0, int: -1, wis: -1 },
      description: "Humans are versatile and ambitious, able to adapt to any situation and excel.",
    },
    orc: {
      bonuses: { str: 5, dex: -2, con: 3, int: -2, wis: -2 },
      description: "Orcs are fierce warriors with strong physical abilities, often driven by strength and survival.",
    },
  } satisfies Record<Type, { bonuses: Record<Attributes.Type, number>; description: string }>;
}

export namespace Effects {
  export type Type = (typeof keys)[number];
  export const keys = [
    "corroding",
    "frostbite",
    "burning",
    "shocked",
    "bleeding",
    "toxin",
    "smitten",
    "hastened",
    "fortified",
    "weakened",
    "regenerating",
    "energized",
    "shielded",
    "enraged",
    "focused",
    "confused",
    "fastened",
    "slowed",
    "stunned",
  ] as const;
}

export namespace Gameplay {
  export type Vector = [x: number, y: number, z: number];
  export type Roll = [rolls: number, dice: number];
}

export namespace Resources {
  export const keys = ["memories", "rage", "actions", "life"] as const;
  export type Type = (typeof keys)[number];
}

export namespace Ability {
  export type Data = {
    name: string;
    mode: "aoe" | "target";
    range?: number;
    targets?: number;
    cost: Partial<Record<Resources.Type, number>>;
    effects: Partial<Record<Effects.Type, number>>;
    damage: [element: Elements.Type, ...Gameplay.Roll][];
  };
  export type Item = {
    id: UUID;
    source: string;
  } & Data;
  export type Learned = {
    id: UUID;
    learned: number;
  } & Data;
}

export namespace Inventory {
  export const variants = [
    "one-hand",
    "two-hand",
    "helmet",
    "armor",
    "gloves",
    "leggings",
    "boots",
    "consumable",
    "misc",
  ] as const;
  export type Variant = (typeof variants)[number];
  export type Data = {
    name: string;
    variant: Variant;
    require?: Partial<Record<Attributes.Type, number>>;
    abilities: Ability.Data[];
    value: number;
    weight: number;
  };
  export type Stack = {
    amount: number;
    equipped: boolean;
  } & Data;
}

export namespace Playable {
  export type Character = {
    id: UUID;
    name: string;
    race: Races.Type;
    resources: Record<Resources.Type | "weight", { current: number; max: number }>;
    inventory: Inventory.Stack[];
    effects: Record<Effects.Type, number>;
    abilities: {
      item: Ability.Item[];
      learned: Ability.Item[];
    };
  };
}
