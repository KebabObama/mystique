export const ATTRIBUTES = {
  str: {
    name: "Strength",
    description:
      "Physical power and athletic prowess. Affects melee attacks and carrying capacity.",
  },
  dex: {
    name: "Dexterity",
    description:
      "Agility, reflexes, and balance. Influences armor class, initiative, and ranged attacks.",
  },
  con: {
    name: "Constitution",
    description:
      "Endurance and stamina. Determines hit points and resistance to physical hardship.",
  },
  int: {
    name: "Intelligence",
    description:
      "Reasoning and memory. Governs arcane spellcasting and knowledge skills.",
  },
  wis: {
    name: "Wisdom",
    description:
      "Awareness and insight. Powers divine magic and perception abilities.",
  },
  cha: {
    name: "Charisma",
    description:
      "Force of personality and leadership. Affects social interactions and certain spells.",
  },
} as const satisfies Record<string, { name: string; description: string }>;

export const attributeKeys = Object.keys(ATTRIBUTES) as Attribute[];

/**
 * Attribute type inferred from {@link ATTRIBUTES}
 */
export type Attribute = keyof typeof ATTRIBUTES;
