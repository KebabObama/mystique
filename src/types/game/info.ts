import { Game } from ".";
// prettier-ignore
export const INFO = {
  ATTRIBUTES: {
    str: { 
      name: "strength",
      description: "Physical might and raw power. Determines how much heavy gear and loot you can carry before becoming encumbered." 
    },
    dex: { 
      name: "dexterity",
      description: "Agility, reflexes, and balance. A higher score allows you to traverse the battlefield with greater speed." 
    },
    con: { 
      name: "constitution",
      description: "Endurance and vital force. Governs your physical resilience and total health pool." 
    },
    int: { 
      name: "intelligence",
      description: "Cognitive capacity and mental storage. Grants 'Memories' — mental tokens required to prepare and manifest spells." 
    },
    wis: { 
      name: "wisdom",
      description: "Intuition and mental clarity. Provides additional actions during your turn, allowing for more complex tactical maneuvers." 
    },
  } satisfies Record<Game.Attribute, { description: string; name: string }>,
  RACES: {
    dragonborn: {
      description: "Descendants of ancient drakes. They possess a natural physical dominance and a fierce elemental heritage, making them formidable front-line warriors.",
      starting: { str: 7, dex: 3, con: 7, wis: 4, int: 4 },
    },
    dwarf: {
      description: "Stout, resilient, and unyielding. Their dense physiology grants them supernatural endurance and the strength to carry the heaviest of mountain-forged armor.",
      starting: { str: 6, dex: 5, con: 6, wis: 4, int: 4 },
    },
    elf: {
      description: "Graceful beings with sharpened senses. They move with an elegance that defies natural speed and possess minds naturally attuned to the flow of ancient memories.",
      starting: { str: 3, dex: 6, con: 4, wis: 6, int: 6 },
    },
    human: {
      description: "Versatile and ambitious. Humans lack the specialized traits of other races but make up for it with a balanced adaptability that allows them to excel in any discipline.",
      starting: { str: 5, dex: 5, con: 5, wis: 5, int: 5 },
    }
  } satisfies Record<Game.Race, { description: string; starting: Record<Game.Attribute, number> }>,
} as const;
