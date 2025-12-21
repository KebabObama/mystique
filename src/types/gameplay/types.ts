import { KEYS } from "./keys";

export type Element = (typeof KEYS.ELEMENTS)[number];
export type Attribute = (typeof KEYS.ATTRIBUTES)[number];
export type Race = (typeof KEYS.RACES)[number] & {};
export type ItemType = (typeof KEYS.ITEM_TYPES)[number] & {};
export type Roll = [amount: number, dice: number];
export type Effect = (typeof KEYS.EFFECTS)[number] & {};
export type Resource = (typeof KEYS.RESOURCES)[number];
export type Values = { current: number; max: number };

export type Cost = Exclude<Resource, "weight">;
export type Ability = {
  name: string;
  damage: [element: Element, ...Roll][];
  effects: Partial<Record<Effect, number>>;
  cost: Partial<Record<Cost, number>>;
};

export type Consumable = { item: string; amount: number } & Ability;
export type Equipment = { item: string } & Ability;
export type Memorized = { memorized: number } & Ability;
export type Stack = Item & { amount: number; equipped: boolean };
export type Item = {
  name: string;
  type: ItemType;
  resistances?: Partial<Record<Element, number>>;
  abilities?: Ability[];
  weight: number;
  value: number;
};

export type Character = {
  name: string;
  race: Race;
  stats: { level: number; points: number };
  effects: Record<Effect, number>;
  resources: Record<Resource, Values>;
  inventory: Stack[];
  abilities: { consumables: Consumable[]; equipment: Equipment[]; memorized: Memorized[] };
};

export type NPC = {
  name: string;
  effects: Record<Effect, number>;
  resources: Record<Resource, Values>;
  inventory: Stack[];
  abilities: { consumables: Consumable[]; equipment: Equipment[]; memorized: Memorized[] };
};

export type Playable = { id: string; owner: string; mesh?: undefined; object: Character | NPC };
