import { Axe, BookAudio, BowArrow, Cross, Flame, Guitar, LucideIcon } from "lucide-react";
import { Attribute } from "./attributes.internal";

export const CLASSES = {
  barbarian: {
    icon: Axe,
    description: "Barbarians are fierce warriors who rely on rage to fuel their attacks and resist damage.",
    resource: { name: "rage", first: 1, levelUp: 1 },
    attribute: "str",
    hp: 10,
  },
  bard: {
    icon: Guitar,
    description: "Bards inspire allies with music and magic, using inspiration to enhance their and others' abilities.",
    resource: { name: "inspiration", first: 2, levelUp: 1 },
    attribute: "cha",
    hp: 8,
  },
  cleric: {
    icon: Cross,
    description: "Clerics channel divine power to heal allies and smite foes, drawing strength from their faith.",
    resource: { name: "faith", first: 2, levelUp: 2 },
    attribute: "wis",
    hp: 6,
  },
  ranger: {
    icon: BowArrow,
    description: "Rangers are skilled hunters and trackers, marking their targets and striking with precision.",
    resource: { name: "mark", first: 3, levelUp: 3 },
    attribute: "dex",
    hp: 8,
  },
  warlock: {
    icon: Flame,
    description:
      "Warlocks wield dark connections with otherworldly entities, using their pact to cast powerful spells.",
    resource: { name: "pact", first: 1, levelUp: 2 },
    attribute: "con",
    hp: 10,
  },
  wizard: {
    icon: BookAudio,
    description: "Wizards study arcane secrets and rely on memory to cast spells with precision and versatility.",
    resource: { name: "memory", first: 4, levelUp: 3 },
    attribute: "int",
    hp: 6,
  },
} as const satisfies Record<
  string,
  {
    icon: LucideIcon;
    description: string;
    resource: { name: string; first: number; levelUp: number };
    attribute: Attribute;
    hp: number;
  }
>;

/**
 * Class type inferred from {@link CLASSES}
 */
export type Class = keyof typeof CLASSES;
