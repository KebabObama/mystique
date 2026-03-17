import { Game } from "@/lib/game";
import { BicepsFlexed, Bone, Brain, Rabbit, type LucideIcon } from "lucide-react";

/** Defines the attribute icon constant. */
export const ATTRIBUTE_ICON: Record<Game.Attribute, LucideIcon> = {
  strength: BicepsFlexed,
  dexterity: Rabbit,
  constitution: Bone,
  intelligence: Brain,
};
