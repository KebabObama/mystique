import { ABILITIES } from "@/lib/data/abilities";
import { Roll } from ".";
import { Attribute } from "./attributes.internal";
import { Effect } from "./effects.internal";
import { Element } from "./elements.internal";

export type Ability = {
  name: (typeof ABILITIES)[number]["name"];
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

export type AbilityPreserve = {
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

export type AbilitySource =
  | { id: string; type: "learned"; amount: number }
  | { id: string; type: "item"; cooldown: number; item: string }; // if cooldown is -1 then the item is consumable
