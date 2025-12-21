// prettier-ignore
export const KEYS = {
  ELEMENTS: ["fire", "cold", "acid", "lightning", "physical", "poison"],
  ATTRIBUTES: ["str", "dex", "con", "wis", "int"],
  RACES: ["dragonborn", "dwarf", "elf", "human"],
  ITEM_TYPES: ["one-hand", "two-hand", "shield", "helmet", "armor", "leggings", "consumable", "misc"],
  RESOURCES:["health", "actions", "memories", "weight"],
  EFFECTS: [ 
    "corroding", "frostbite", "burning", "shocked", "bleeding", "toxin", "smitten", "hastened", "fortified", 
    "weakened", "regenerating", "energized", "shielded", "enraged", "focused", "confused", "fastened", "slowed", "stunned",
  ],
} as const;
