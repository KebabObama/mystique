import { ELEMENTS } from "./elements.internal";

/**
 * @corroding       [{@link ELEMENTS acid}] Remove all resistances other than acid per stack
 * @frostbite       [{@link ELEMENTS cold}] Removes half a tile per stack (Rounded up)
 * @burning         [{@link ELEMENTS fire}] Deals damage equal to half stacks
 * @shocked         [{@link ELEMENTS lightning}] Decreases damage by half of the stacks (Rounded up)
 * @bleeding        [{@link ELEMENTS physical}] Deals 1 dmg each turn and each tile entity moves
 * @toxin           [{@link ELEMENTS poison}] Deals damage equal to current health divided by stacks
 * @smitten         [{@link ELEMENTS radiant}] Decreases caused effects per stack
 * @hastened        Adds 1 action
 * @fortified       Reduces incoming damage per stack
 * @weakened        Increases incoming damage per stack
 * @regenerating    Heals HP per stack
 * @energized       Restores 1 resource
 * @enraged         Doubles damage dealt
 * @focused         Doubles hit chance
 * @confused        Halves hit chance
 * @fastened        Doubles movement speed
 * @slowed          Halves movement speed
 * @stunned         Removes all actions
 */

export const EFFECTS = [
  "corroding",
  "frostbite",
  "burning",
  "shocked",
  "bleeding",
  "toxin",
  "smitten",
  "hastened",
  "fortified",
  "weakened",
  "regenerating",
  "energized",
  "shielded",
  "enraged",
  "focused",
  "confused",
  "fastened",
  "slowed",
  "stunned",
] as const;

/**
 * Effect type inferred from {@link EFFECTS}
 */
export type Effect = (typeof EFFECTS)[number];
