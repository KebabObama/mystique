import {
  CASTNAME,
  ITEM_TYPES,
  RESOURCES,
  type ATTRIBUTES,
  type CLASSES,
  type EFFECTS,
  type ELEMENTS,
  type RACES,
} from "./consts";

export type Vector = [x: number, y: number, z: number];
export type Roll = [rolls: number, dice: number, bonus: number];
export type Element = (typeof ELEMENTS)[number];
export type Class = (typeof CLASSES)[number];
export type Race = (typeof RACES)[number];
export type Attribute = (typeof ATTRIBUTES)[number];
export type Effect = (typeof EFFECTS)[number];
export type Inventory = { [key: string]: Item | undefined };
export type ItemType = (typeof ITEM_TYPES)[number];
export type Resource = (typeof RESOURCES)[number];
export type Castname = (typeof CASTNAME)[Class];

export type Action = {
  id: string;
  name: string;
  modifier: Attribute;
  concentration: number;
  targeting: Vector | number;
  range: number;
  effects: [effect: Effect, amount: number][];
  damage: [...Roll, element: Element][];
};

export type Item = {
  id: string;
  name: string;
  type: ItemType;
  weight: number;
  action: Action["id"][];
  effects: [effect: Effect, amount: number][];
  resistances: [element: Element, amount: number][];
};

export type Entity = {
  name: string;
  level: number;
  class: Class;
  attributes: Record<Attribute, number>;
  actions: Action["id"][];
  resources: Record<Resource, [amount: number, max: number]>;
  inventory: Inventory;
  effects: Record<Effect, number>;
  resistances: Record<Element, number>;
};

export type Character = Entity & { race: Race };
