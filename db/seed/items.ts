import { db, schema } from "../../lib/db";
import { focusBolt, stab, strike } from "./abilities";

// prettier-ignore
const ITEMS: (typeof schema.item.$inferInsert)[] = [
	{
		name: "Gold Coin",
		type: "misc",
		value: 1,
		weight: 0,
		armor: null,
		abilities: [],
		requiremnts: {},
	},
	{
		name: "Training Sword",
		type: "weapon",
		value: 8,
		weight: 2,
		armor: null,
		abilities: [strike(2, 4)],
		requiremnts: { strength: 4, dexterity: 3, constitution: null, intelligence: null },
	},
	{
		name: "Rough Dagger",
		type: "weapon",
		value: 7,
		weight: 1,
		armor: null,
		abilities: [stab(1, 5)],
		requiremnts: { strength: 2, dexterity: 5, constitution: null, intelligence: null },
	},
	{
		name: "Initiate Wand",
		type: "weapon",
		value: 10,
		weight: 1,
		armor: null,
		abilities: [focusBolt(2, 4)],
		requiremnts: { strength: null, dexterity: null, constitution: null, intelligence: 5 },
	},
	{
		name: "Worn Leather Cap",
		type: "helmet",
		value: 4,
		weight: 1,
		armor: 1,
		abilities: [],
		requiremnts: {},
	},
	{
		name: "Padded Vest",
		type: "armor",
		value: 6,
		weight: 3,
		armor: 2,
		abilities: [],
		requiremnts: { strength: 3 },
	},
	{
		name: "Traveler Ring",
		type: "ring",
		value: 5,
		weight: 0,
		armor: 0,
		abilities: [],
		requiremnts: {},
	},
];

export const seed = async () => {
  const inserted = await db
    .insert(schema.item)
    .values(ITEMS)
    .onConflictDoNothing({ target: schema.item.name })
    .returning({ id: schema.item.id });

  console.info(
    `[seed] Added ${inserted.length} new item(s), skipped ${ITEMS.length - inserted.length} existing item(s).`
  );
};
