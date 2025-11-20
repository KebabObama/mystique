import { Attribute } from "./attributes.internal";

export const RACES = {
  dragonborn: {
    description:
      "Dragonborn are proud draconic humanoids, often seeking honor and glory while wielding elemental breath.",
    bonuses: { str: 1, dex: -1, con: 1, int: 0, wis: 1, cha: -2 },
    stamina: -1,
  },
  dwarf: {
    description:
      "Dwarves are sturdy and resilient, skilled in crafting, mining, and combat, often living in mountain strongholds.",
    bonuses: { str: 1, dex: -2, con: 2, int: 0, wis: 0, cha: -1 },
    stamina: -2,
  },
  elf: {
    description:
      "Elves are graceful and long-lived, attuned to nature and magic, excelling in agility and perception.",
    bonuses: { str: -3, dex: 3, con: -3, int: 1, wis: 1, cha: 1 },
    stamina: 2,
  },
  human: {
    description:
      "Humans are versatile and ambitious, able to adapt to any situation and excel in a wide variety of skills.",
    bonuses: { str: -1, dex: 1, con: 0, int: -1, wis: -1, cha: 2 },
    stamina: 2,
  },
  orc: {
    description:
      "Orcs are fierce warriors with strong physical abilities, often driven by strength, honor, or survival instincts.",
    bonuses: { str: 5, dex: -2, con: 3, int: -2, wis: -2, cha: -2 },
    stamina: -2,
  },
  tiefling: {
    description:
      "Tieflings are descended from fiends, possessing innate magical abilities and often facing prejudice due to their heritage.",
    bonuses: { str: 1, dex: 1, con: 1, int: 0, wis: -2, cha: -1 },
    stamina: 0,
  },
} as const satisfies Record<
  string,
  { description: string; bonuses: Record<Attribute, number>; stamina: number }
>;

/**
 * Race type inferred from {@link RACES}
 */
export type Race = keyof typeof RACES;
