export const Constants = {
  ELEMENTS: ["fire", "cold", "acid", "lightning", "physical", "poison"],
  ATTRIBUTES: ["str", "dex", "con", "wis", "int", "cha"],
  RACES: ["dragonborn", "dwarf", "elf", "human", "orc", "tiefling"],
  ITEM_TYPES: [
    "one-hand",
    "two-hand",
    "consumable",
    "helmet",
    "armor",
    "gloves",
    "ring",
    "necklace",
    "backpack",
    "cape",
    "shield",
    "leggings",
    "boots",
    "misc",
  ],
} as const;

export namespace GameTypes {
  export type Roll = [rolls: number, dice: number, bonus?: number];
  export type Attribute = (typeof Constants.ATTRIBUTES)[number];
  export type Race = (typeof Constants.RACES)[number];
  export type Element = (typeof Constants.ELEMENTS)[number];
}
export namespace Item {
  export type Types = (typeof Constants.ITEM_TYPES)[number];

  export namespace Variants {
    export type Base = {
      name: string;
      weight: number;
      value: number;
    };
    export type Weapon = Base & {
      abilities: string[];
      type: Extract<Item.Types, "one-hand" | "two-hand">;
    };
    export type Armor = Base & {
      abilities: string[];
      type: Extract<
        Item.Types,
        "shield" | "helmet" | "armor" | "gloves" | "ring" | "necklace" | "cape" | "leggings" | "boots"
      >;
      resistances: Record<GameTypes.Element, number>;
      armor: number;
    };
  }
}
