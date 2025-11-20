export const ITEM_TYPES = [
  "one-hand",
  "two-hand",
  "consumable",
  "helmet",
  "armor",
  "gloves",
  "leggings",
  "boots",
  "currency",
  "misc",
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];
