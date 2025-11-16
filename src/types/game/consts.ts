export const CLASSES = [
  "barbarian",
  "cleric",
  "ranger",
  "wizard",
  "warlock",
] as const;

export const RACES = [
  "dragonborn",
  "dwarf",
  "elf",
  "human",
  "orc",
  "tiefling",
] as const;

export const ELEMENTS = [
  "acid",
  "blunt",
  "cold",
  "fire",
  "necrotic",
  "pierce",
  "poison",
  "slash",
  "thunder",
  "psychic",
] as const;

export const ATTRIBUTES = ["str", "dex", "con", "wis", "int", "cha"] as const;

export const EFFECTS = [
  // DoT
  "burning",
  "bleeding",
  "poisoned",
  "corroding",

  // Crowd control
  "stunned",
  "frozen",
  "slowed",
  "silenced",
  "blinded",
  "confused",

  // Debuff
  "shocked",
  "broken",
  "weakened",
  "cursed",
  "shattered",
  "vulnerable",

  // Buff
  "battlecry",
  "regenerating",
  "shielded",
  "hasted",
  "strengthened",
  "focused",
  "invisible",
] as const;

export const ITEM_TYPES = [
  "one-hand",
  "two-hand",
  "potion",
  "throwable",
  "helmet",
  "armor",
  "gloves",
  "leggings",
  "boots",
  "ammunition",
  "cloak",
  "ring",
  "pendant",
  "currency",
  "storage",
  "misc",
] as const;

export const RESOURCES = ["hp", "cast", "actions", "stamina"] as const;

export const CASTNAME = {
  barbarian: "rage",
  cleric: "divinity",
  ranger: "mark",
  warlock: null,
  wizard: "memory",
} as const;
