import { EFFECTS } from "./effects.internal";

/**
 * @acid {@link EFFECTS corroding}
 * @cold {@link EFFECTS frostbite}
 * @fire {@link EFFECTS burning}
 * @lightning {@link EFFECTS shocked}
 * @physical {@link EFFECTS bleeding}
 * @poison {@link EFFECTS toxin}
 * @radiant {@link EFFECTS smitten}
 */

export const ELEMENTS = ["acid", "cold", "fire", "lightning", "physical", "poison", "radiant"] as const;

/**
 * Element type inferred from {@link ELEMENTS}
 */
export type Element = (typeof ELEMENTS)[number];
