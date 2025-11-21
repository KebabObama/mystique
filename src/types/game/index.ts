import { Ability, AbilitySource } from "./abilities.internal";
import { Attribute } from "./attributes.internal";
import { Class } from "./classes.internal";
import { Effect } from "./effects.internal";
import { Element } from "./elements.internal";
import { ItemType } from "./items.internal";
import { Race } from "./races.internal";

export type Roll = [rolls: number, dice: number, bonus?: number];
export type Vec = [x: number, y: number, z: number];

export type Abilities = (Ability & AbilitySource)[];

export type Item = {
  name: string;
  type: ItemType;
  abilities: Ability["name"][];
  effects: [effect: Effect, amount: number][];
  resistances: [element: Element, amount: number][];
  weight: number;
  canStack: boolean;
};

export type Equipment = {
  helmet?: string;
  armor?: string;
  gloves?: string;
  leggings?: string;
  boots?: string;
  left?: string;
  right?: string;
};

export type InventoryItem = Item & { id: string };
export type inventory = InventoryItem[];

export type Object = { id: string; owner: string; position: Vec; size: Vec; model?: string };

export type Character = {
  name: string;
  level: number;
  class: Class;
  race: Race;
  effects: Record<Effect, number>;
  attributes: Record<Attribute, number>;
  health: [current: number, max: number];
  stamina: [current: number, max: number];
  actions: [current: number, max: number];
  resource: [current: number, max: number];
  weight: [current: number, max: number];
  resistances: Record<Element, number>;
  inventory: InventoryItem[];
  abilities: Abilities;
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
  abilities: Abilities;
  equipment: Equipment;
};

export type InGamePlayable = (Character | NPC) & Object;

export type Game = {
  id: string;
  objects: Object[];
  playable: InGamePlayable[];
  sequence: { current: string; order: string[] };
  dm: string;
};
