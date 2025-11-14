import type { ATTRIBUTES, CLASSES, EFFECTS, ELEMENTS, RACES } from "./consts";

export type Vector = [x: number, y: number, z: number];
export type Roll = [rolls: number, dice: number, bonus: number];
export type Element = (typeof ELEMENTS)[number];
export type Class = (typeof CLASSES)[number];
export type Race = (typeof RACES)[number];
export type Attribute = (typeof ATTRIBUTES)[number];
export type Effect = (typeof EFFECTS)[number];
export type Inventory = { [key: string]: Item | undefined };

export type Action = {
	id: string;
	name: string;
	modifier: Attribute;
	concentration: boolean;
	targeting: Vector | number;
	range: number;
	effects: [effect: Effect, amount: number][];
	damage: [...Roll, element: Element][];
};

export type Item = {
	id: string;
	name: string;
	type:
		| "one-hand"
		| "two-hand"
		| "potion"
		| "granade"
		| "helmet"
		| "armor"
		| "gloves"
		| "leggings"
		| "boots"
		| "ammunition"
		| "cloak"
		| "ring"
		| "pendant"
		| "currency"
		| "storage"
		| "misc";
	weight: number;
	storage: Inventory;
	actions: Action["id"][];
	requirements: [attribute: Attribute, amount: number][];
	effects: [effect: Effect, amount: number][];
	resistances: [element: Element, amount: number][];
};

export type Entity = {
	name: string;
	level: number;
	class: Class;
	race: string;
	attributes: Record<Attribute, number>;
	actions: Action["id"][];
};

export type Character = Entity & {
	race: Race;
	inventory: Inventory;
	resistances: Record<Element, number>;
};
